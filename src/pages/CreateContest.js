import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Select,
} from "@windmill/react-ui";
import api from "../utils/api";

// Utility: Convert Date to IST and format as yyyy-MM-ddTHH:mm for datetime-local input
function toISTLocalString(date) {
  const IST_OFFSET = 5.5 * 60; // minutes
  // Convert to IST
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (IST_OFFSET * 60000));
  // Format for datetime-local input
  const yyyy = ist.getFullYear();
  const MM = String(ist.getMonth() + 1).padStart(2, '0');
  const dd = String(ist.getDate()).padStart(2, '0');
  const hh = String(ist.getHours()).padStart(2, '0');
  const mm = String(ist.getMinutes()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

function CreateContest() {
  const history = useHistory();
  const [leagues, setLeagues] = useState([]);
  const [formData, setFormData] = useState({
    leagueId: "", // Add leagueId
    name: "",
    description: "",
    type: "STOCK",
    entryFee: "", // Changed from 0 to empty string
    maxParticipants: 2,
    startDate: toISTLocalString(new Date()), // Initialize with current IST date-time
    endDate: toISTLocalString(new Date(Date.now() + 86400000)), // Next day IST
    stockSelectionDeadline: toISTLocalString(new Date()), // Initialize with current IST date-time
    prizePool: {
      totalAmount: 0,
      distribution: [
        { rank: 1, percentage: 50, amount: 0 },
        { rank: 2, percentage: 30, amount: 0 },
        { rank: 3, percentage: 20, amount: 0 },
      ],
    },
    status: "upcoming",
  });

  useEffect(() => {
    // Fetch leagues when component mounts
    const fetchLeagues = async () => {
      try {
        const response = await api.getLeagues();
        setLeagues(response.data);
      } catch (error) {
        console.error("Error fetching leagues:", error);
      }
    };
    fetchLeagues();
  }, []);

  // Always treat input as IST string
  const handleDateChange = (field, value) => {
    setFormData((prev) => {
      let updates = { ...prev, [field]: value };
      // Ensure logical date order (all values are IST strings)
      if (field === "startDate" && value > prev.endDate) {
        updates.endDate = value;
        updates.stockSelectionDeadline = value;
      }
      if (field === "endDate" && value < prev.startDate) {
        updates.endDate = prev.startDate;
      }
      if (field === "stockSelectionDeadline") {
        if (value < prev.startDate) {
          updates.stockSelectionDeadline = prev.startDate;
        }
        if (value > prev.endDate) {
          updates.stockSelectionDeadline = prev.endDate;
        }
      }
      return updates;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert IST datetime-local strings to ISO8601 with +05:30 offset before sending
      const convertToISTISOString = (dtStr) => {
        // dtStr is in 'yyyy-MM-ddTHH:mm' assumed IST, so manually add offset
        return dtStr + ":00+05:30";
      };
      const payload = {
        ...formData,
        startDate: convertToISTISOString(formData.startDate),
        endDate: convertToISTISOString(formData.endDate),
        stockSelectionDeadline: convertToISTISOString(formData.stockSelectionDeadline),
      };
      console.log("Submitting contest data (IST):", payload);
      const response = await api.createContest(payload);
      console.log("Server response:", response);
      // Navigate back to contests page after successful creation
      history.push("/app/contests");
    } catch (error) {
      console.error("Error creating contest:", error);
      alert(error.message || "Failed to create contest");
    }
  };


  return (
    <>
      <PageTitle>Create New Contest</PageTitle>

      <Card className="mb-8">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Label className="col-span-2">
                <span>Select League *</span>
                <Select
                  className="mt-1"
                  value={formData.leagueId}
                  onChange={(e) =>
                    setFormData({ ...formData, leagueId: e.target.value })
                  }
                  required
                >
                  <option value="">Select a league</option>
                  {leagues.map((league) => (
                    <option key={league._id} value={league._id}>
                      {league.name} ({league.type})
                    </option>
                  ))}
                </Select>
              </Label>
            </div>

            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Basic Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Label className="col-span-2">
                <span>Contest Name *</span>
                <Input
                  className="mt-1"
                  placeholder="Enter contest name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Label>

              <Label>
                <span>Type *</span>
                <Select
                  className="mt-1"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  <option value="STOCK">Stock</option>
                  <option value="CRYPTO">Crypto</option>
                </Select>
              </Label>

              <Label>
                <span>Entry Fee (₹) *</span>
                <Input
                  className="mt-1"
                  type="number"
                  min="0"
                  placeholder="Enter entry fee"
                  value={formData.entryFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      entryFee: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  required
                />
              </Label>

              <Label>
                <span>Max Participants (2-100) *</span>
                <Input
                  className="mt-1"
                  type="number"
                  min="2"
                  max="100"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxParticipants: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  required
                />
              </Label>

              <Label>
                <span>Prize Pool (₹) *</span>
                <Input
                  className="mt-1"
                  type="number"
                  min="0"
                  value={formData.prizePool.totalAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prizePool: {
                        ...formData.prizePool,
                        totalAmount: e.target.value === "" ? "" : Number(e.target.value),
                      },
                    })
                  }
                  required
                />
              </Label>
            </div>

            <hr className="my-8" />

            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Contest Timing
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Label>
                <span>Start Date *</span>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  min={toISTLocalString(new Date())}
                  value={formData.startDate}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  required
                />
              </Label>

              <Label>
                <span>End Date *</span>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  min={formData.startDate}
                  value={formData.endDate}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  required
                />
              </Label>

              <Label>
                <span>Stock Selection Deadline *</span>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  min={formData.startDate}
                  max={formData.endDate}
                  value={formData.stockSelectionDeadline}
                  onChange={(e) =>
                    handleDateChange("stockSelectionDeadline", e.target.value)
                  }
                  required
                />
              </Label>
            </div>

            <hr className="my-8" />

            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Contest Description
            </h2>
            <Label>
              <span>Description *</span>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-purple-400 focus:ring focus:ring-purple-300 dark:focus:ring-gray-300 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300"
                rows="5"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Label>

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                layout="outline"
                onClick={() => history.push("/app/contests")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Contest</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default CreateContest;

import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
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

function EditContest() {
  const history = useHistory();
  const { id } = useParams();
  const [leagues, setLeagues] = useState([]);
  const [formData, setFormData] = useState({
    leagueId: "",
    name: "",
    description: "",
    type: "STOCK",
    entryFee: "",
    maxParticipants: 2,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    stockSelectionDeadline: new Date().toISOString().slice(0, 16),
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
    const fetchContestAndLeagues = async () => {
      try {
        // Fetch contest details
        const contestResponse = await api.getAdminContestDetails(id);
        const contestData = contestResponse.data;
        
        // Set form data with contest details
        setFormData({
          ...contestData,
          startDate: new Date(contestData.startDate).toISOString().slice(0, 16),
          endDate: new Date(contestData.endDate).toISOString().slice(0, 16),
          stockSelectionDeadline: new Date(contestData.stockSelectionDeadline).toISOString().slice(0, 16),
        });

        // Fetch leagues
        const leaguesResponse = await api.getLeagues();
        setLeagues(leaguesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load contest details");
        history.push("/app/contests");
      }
    };

    fetchContestAndLeagues();
  }, [id, history]);

  const handleDateChange = (field, value) => {
    setFormData((prev) => {
      const updates = { ...prev, [field]: value };

      // if (field === "startDate" && new Date(value) > new Date(prev.endDate)) {
      //   updates.endDate = value;
      //   updates.stockSelectionDeadline = value;
      // }

      // if (field === "endDate" && new Date(value) < new Date(prev.startDate)) {
      //   updates.endDate = prev.startDate;
      // }

      // if (field === "stockSelectionDeadline") {
      //   const selectionDate = new Date(value);
      //   const startDate = new Date(prev.startDate);
      //   const endDate = new Date(prev.endDate);

      //   if (selectionDate < startDate) {
      //     updates.stockSelectionDeadline = prev.startDate;
      //   }
      //   if (selectionDate > endDate) {
      //     updates.stockSelectionDeadline = prev.endDate;
      //   }
      // }

      return updates;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.updateAdminContest(id, formData);
      history.push("/app/contests");
    } catch (error) {
      console.error("Error updating contest:", error);
      alert(error.message || "Failed to update contest");
    }
  };

  return (
    <>
      <PageTitle>Edit Contest</PageTitle>

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
                <span>Max Participants (Minimum 2) *</span>
                <Input
                  className="mt-1"
                  type="number"
                  min="2"
                  placeholder="Enter max participants"
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
                  min={new Date().toISOString().slice(0, 16)}
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
                  // min={formData.startDate}
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
              <Button type="submit">Update Contest</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default EditContest; 
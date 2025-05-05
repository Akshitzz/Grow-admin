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
  Textarea,
  ToggleSwitch,
} from "@windmill/react-ui";
import api from "../utils/api";

function CreateMegaContest() {
  const history = useHistory();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    leagueId: "",
    name: "",
    description: "",
    type: "STOCK",
    entryFee: "",
    maxParticipants: 100,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    stockSelectionDeadline: new Date().toISOString().slice(0, 16),
    status: "upcoming",
    megaContest: true,
    prizePool: {
      totalAmount: 0,
      distribution: [
        { rank: 1, percentage: 50, amount: 0 },
        { rank: 2, percentage: 30, amount: 0 },
        { rank: 3, percentage: 20, amount: 0 },
      ],
    },
  });

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await api.getLeagues();
        setLeagues(response.data);
      } catch (error) {
        console.error("Error fetching leagues:", error);
        setError("Failed to load leagues");
      }
    };
    fetchLeagues();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrizeDistributionChange = (index, field, value) => {
    const newDistribution = [...formData.prizePool.distribution];
    newDistribution[index] = {
      ...newDistribution[index],
      [field]: Number(value),
    };
    setFormData((prev) => ({
      ...prev,
      prizePool: {
        ...prev.prizePool,
        distribution: newDistribution,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.name || !formData.entryFee || !formData.maxParticipants || 
          !formData.startDate || !formData.endDate || !formData.stockSelectionDeadline || 
          !formData.leagueId) {
        throw new Error("Please fill in all required fields");
      }

      // Format dates and numbers
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        stockSelectionDeadline: new Date(formData.stockSelectionDeadline).toISOString(),
        entryFee: Number(formData.entryFee),
        maxParticipants: Number(formData.maxParticipants),
        megaContest: true,
        prizePool: {
          ...formData.prizePool,
          totalAmount: Number(formData.prizePool.totalAmount),
          distribution: formData.prizePool.distribution.map(prize => ({
            ...prize,
            percentage: Number(prize.percentage),
            amount: Number(prize.amount)
          }))
        }
      };

      console.log("Submitting mega contest data:", formattedData);
      await api.createContest(formattedData);
      alert("Mega contest created successfully!");
      history.push("/app/contests");
    } catch (error) {
      console.error("Error creating contest:", error);
      setError(error.message || "Failed to create contest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle>Create Mega Contest</PageTitle>

      <Card className="mb-8">
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Label>
                <span>Contest Name *</span>
                <Input
                  className="mt-1"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter contest name"
                  required
                />
              </Label>

              <Label>
                <span>League *</span>
                <Select
                  className="mt-1"
                  name="leagueId"
                  value={formData.leagueId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a league</option>
                  {leagues.map((league) => (
                    <option key={league._id} value={league._id}>
                      {league.name}
                    </option>
                  ))}
                </Select>
              </Label>

              <Label>
                <span>Entry Fee (₹) *</span>
                <Input
                  className="mt-1"
                  type="number"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleInputChange}
                  placeholder="Enter entry fee"
                  required
                />
              </Label>

              <Label>
                <span>Max Participants *</span>
                <Input
                  className="mt-1"
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="Enter max participants"
                  min="100"
                  required
                />
              </Label>

              <Label>
                <span>Start Date *</span>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </Label>

              <Label>
                <span>End Date *</span>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </Label>

              <Label>
                <span>Stock Selection Deadline *</span>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  name="stockSelectionDeadline"
                  value={formData.stockSelectionDeadline}
                  onChange={handleInputChange}
                  required
                />
              </Label>

              <Label>
                <span>Contest Type</span>
                <Select
                  className="mt-1"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="STOCK">Stock</option>
                  <option value="CRYPTO">Crypto</option>
                </Select>
              </Label>
            </div>

            <Label className="mb-4">
              <span>Description</span>
              <Textarea
                className="mt-1"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter contest description"
                rows="3"
              />
            </Label>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Prize Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.prizePool.distribution.map((prize, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Label>
                      <span>Rank {prize.rank}</span>
                      <Input
                        className="mt-1"
                        type="number"
                        value={prize.percentage}
                        onChange={(e) =>
                          handlePrizeDistributionChange(
                            index,
                            "percentage",
                            e.target.value
                          )
                        }
                        placeholder="Percentage"
                        min="0"
                        max="100"
                      />
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-600 mb-4">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                layout="outline"
                onClick={() => history.push("/app/contests")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Mega Contest"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default CreateMegaContest; 
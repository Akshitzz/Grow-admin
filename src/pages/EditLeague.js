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

function EditLeague() {
  const history = useHistory();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "STOCK",
    status: "active",
  });

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const response = await api.getLeagueDetails(id);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching league:", error);
        alert("Failed to load league details");
        history.push("/app/leagues");
      }
    };

    fetchLeague();
  }, [id, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.updateLeague(id, formData);
      history.push("/app/leagues");
    } catch (error) {
      console.error("Error updating league:", error);
      alert(error.message || "Failed to update league");
    }
  };

  return (
    <>
      <PageTitle>Edit League</PageTitle>

      <Card className="mb-8">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Label className="col-span-2">
                <span>League Name *</span>
                <Input
                  className="mt-1"
                  placeholder="Enter league name"
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
                <span>Status *</span>
                <Select
                  className="mt-1"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </Label>
            </div>

            <hr className="my-8" />

            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              League Description
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
                onClick={() => history.push("/app/leagues")}
              >
                Cancel
              </Button>
              <Button type="submit">Update League</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default EditLeague; 
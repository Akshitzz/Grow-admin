import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import {
  Card,
  CardBody,
  Input,
  Label,
  Select,
  Button,
} from "@windmill/react-ui";
import api from "../utils/api";

function CreateLeague() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "STOCK",
    status: "active",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createLeague(formData);
      history.push("/app/leagues");
    } catch (error) {
      console.error("Error creating league:", error);
      alert(error.message || "Failed to create league");
    }
  };

  return (
    <>
      <PageTitle>Create New League</PageTitle>
      <Card className="mb-8">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Label>
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
              <span>Description *</span>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-purple-400 focus:ring focus:ring-purple-300 dark:focus:ring-gray-300 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Label>

            <div className="flex justify-end space-x-4">
              <Button
                layout="outline"
                onClick={() => history.push("/app/leagues")}
              >
                Cancel
              </Button>
              <Button type="submit">Create League</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default CreateLeague;

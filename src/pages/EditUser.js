import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import {
  Input,
  Label,
  Select,
  Button,
  Card,
  CardBody,
} from "@windmill/react-ui";
import api from "../utils/api";

function EditUser() {
  const { id } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    accountStatus: "active",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.getUserDetails(id);
        const { username, email, fullName, phoneNumber, accountStatus } =
          data.data;
        setFormData({ username, email, fullName, phoneNumber, accountStatus });
      } catch (error) {
        console.error("Error fetching user:", error);
        if (
          error.message.includes("unauthorized") ||
          error.message.includes("no token")
        ) {
          history.push("/login");
        }
      }
    };

    fetchUser();
  }, [id, history]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateUser(id, formData);
      history.push(`/app/users/${id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      if (
        error.message.includes("unauthorized") ||
        error.message.includes("no token")
      ) {
        history.push("/login");
      }
    }
  };

  return (
    <>
      <PageTitle>Edit User</PageTitle>

      <Card className="mb-8">
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <Label>
                <span>Full Name</span>
                <Input
                  className="mt-1"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Label>

              <Label>
                <span>Username</span>
                <Input
                  className="mt-1"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Label>

              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Label>

              <Label>
                <span>Phone Number</span>
                <Input
                  className="mt-1"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </Label>

              <Label>
                <span>Account Status</span>
                <Select
                  className="mt-1"
                  name="accountStatus"
                  value={formData.accountStatus}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="blocked">Blocked</option>
                </Select>
              </Label>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                layout="outline"
                onClick={() => history.goBack()}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default EditUser;

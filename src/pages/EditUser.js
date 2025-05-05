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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await api.deleteUser(id);
      history.push("/app/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  const handleBlockClick = () => {
    setBlockModal(true);
  };

  const handleBlockConfirm = async () => {
    setLoading(true);
    try {
      await api.BlockUser(id);
      // Refresh user data after blocking
      const data = await api.getUserDetails(id);
      const { username, email, fullName, phoneNumber, accountStatus } = data.data;
      setFormData({ username, email, fullName, phoneNumber, accountStatus });
      setBlockModal(false);
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user. Please try again.");
    } finally {
      setLoading(false);
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
                  <option value="blocked">Blocked</option>
                </Select>
              </Label>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                layout="outline"
                onClick={() => history.goBack()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                layout="outline"
                onClick={handleBlockClick}
                disabled={loading}
              >
                {formData.accountStatus === "active" ? "Block User" : "Unblock User"}
              </Button>
              <Button
                type="button"
                layout="outline"
                onClick={handleDeleteClick}
                disabled={loading}
              >
                Delete User
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this user? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button
            layout="outline"
            onClick={() => setDeleteModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            layout="danger"
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={blockModal} onClose={() => setBlockModal(false)}>
        <ModalHeader>
          {formData.accountStatus === "active" ? "Block User" : "Unblock User"}
        </ModalHeader>
        <ModalBody>
          Are you sure you want to {formData.accountStatus === "active" ? "block" : "unblock"} this user?
        </ModalBody>
        <ModalFooter>
          <Button
            layout="outline"
            onClick={() => setBlockModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            layout="warning"
            onClick={handleBlockConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : formData.accountStatus === "active" ? "Block" : "Unblock"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default EditUser;

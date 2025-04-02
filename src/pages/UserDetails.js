import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody, Button, Badge } from "@windmill/react-ui";
import api from "../utils/api";

function UserDetails() {
  const { id } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await api.getUserDetails(id);
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        if (
          error.message.includes("unauthorized") ||
          error.message.includes("no token")
        ) {
          history.push("/login");
          return;
        }
        setError("Failed to load user details");
      }
    };

    fetchUserDetails();
  }, [id, history]);

  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>User Details</PageTitle>
        <Link to={`/app/users/${id}/edit`}>
          <Button>Edit User</Button>
        </Link>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card className="text-white">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">Full Name</p>
                <p className="font-semibold text-white">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Username</p>
                <p className="font-semibold text-white">@{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Email</p>
                <p className="font-semibold text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Phone</p>
                <p className="font-semibold text-white">
                  {user.phoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Account Status</p>
                <Badge
                  type={user.accountStatus === "active" ? "success" : "danger"}
                >
                  {user.accountStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-300">Member Since</p>
                <p className="font-semibold text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="text-white">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Financial Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">Wallet Balance</p>
                <p className="font-semibold text-white">
                  ₹{user.walletBalance}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Virtual Funds</p>
                <p className="font-semibold text-white">₹{user.virtualFunds}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Loyalty Points</p>
                <p className="font-semibold text-white">{user.loyaltyPoints}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="md:col-span-2 text-white">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-300">Total Contests</p>
                <p className="font-semibold text-white">
                  {user.performanceMetrics?.totalContestsJoined || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Contests Won</p>
                <p className="font-semibold text-white">
                  {user.performanceMetrics?.totalContestsWon || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Win Rate</p>
                <p className="font-semibold text-white">
                  {user.performanceMetrics?.winRate || 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Total Winnings</p>
                <p className="font-semibold text-white">
                  ₹{user.performanceMetrics?.totalWinnings || 0}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default UserDetails;

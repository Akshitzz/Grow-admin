import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Badge,
  Button,
  Pagination,
  Card,
  CardBody,
} from "@windmill/react-ui";
import api from "../utils/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []); // Remove page dependency to fetch all users at once

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getAllUsers();

      if (!response || !response.data) {
        throw new Error("Invalid response format");
      }

      // Transform and enrich the data
      const enrichedUsers = (response.data || []).map((user) => ({
        ...user,
        isActive: user.accountStatus === "active",
        joinedDate: new Date(user.createdAt).toLocaleDateString(),
        performanceStats: {
          totalContests: user.performanceMetrics?.totalContestsJoined || 0,
          totalWins: user.performanceMetrics?.totalContestsWon || 0,
          winRate: user.performanceMetrics?.winRate || 0,
          totalWinnings: user.performanceMetrics?.totalWinnings || 0,
          highestRank: user.performanceMetrics?.highestRank || 0,
        },
        portfolioCount: user.portfolios?.length || 0,
        contestCount: user.contestsParticipated?.length || 0,
      }));

      setUsers(enrichedUsers);
      setTotalResults(enrichedUsers.length);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Calculate pagination
  const startIndex = (page - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return (
    <>
      <PageTitle>Users</PageTitle>
      <Card className="mb-8">
        <CardBody>
          <TableContainer>
            <Table>
              <TableHeader>
                <tr className="text-white">
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Wallet & Points</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex flex-col text-white">
                        <span className="font-semibold">{user.fullName}</span>
                        <span className="text-xs text-gray-400">
                          @{user.username}
                        </span>
                        <span className="text-xs text-gray-400">
                          Joined: {user.joinedDate}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-white">
                        <span>{user.email}</span>
                        <span className="text-xs text-gray-400">
                          {user.phoneNumber}
                        </span>
                        <span className="text-xs text-gray-400">
                          Ref: {user.referralCode}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-white">
                        <span>Contests: {user.performanceStats?.totalContests || 0}</span>
                        <span className="text-xs text-gray-400">
                          Wins: {user.performanceStats?.totalWins || 0}
                        </span>
                        <span className="text-xs text-gray-400">
                          Win Rate: {user.performanceStats?.winRate || 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-white">
                        <span>₹{(user.walletBalance || 0).toLocaleString()}</span>
                        <span className="text-xs text-gray-400">
                          Virtual: ₹{(user.virtualFunds || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          Points: {user.loyaltyPoints || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge type={user.isActive ? "success" : "danger"}>
                          {user.accountStatus}
                        </Badge>
                        <Badge type={user.kycDetails?.isVerified ? "success" : "warning"} className="mt-1">
                          {user.kycDetails?.isVerified ? "KYC Verified" : "KYC Pending"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/app/users/${user._id}`}>
                        <Button layout="link" size="small">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={handlePageChange}
                label="Users navigation"
              />
            </div>
          </TableContainer>
        </CardBody>
      </Card>
    </>
  );
}

export default Users;

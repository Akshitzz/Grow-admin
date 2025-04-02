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
  const resultsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [page]);

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
        isActive: user.lastLoginAt
          ? new Date(user.lastLoginAt) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          : false,
        status: user.status || "active",
        portfolioCount: user.portfolios?.length || 0,
        contestCount: user.contests?.length || 0,
        totalWinnings:
          user.portfolios?.reduce((acc, p) => acc + (p.winnings || 0), 0) || 0,
        joinedDate: new Date(user.createdAt).toLocaleDateString(),
        winCount: user.portfolios?.filter((p) => p.winnings > 0).length || 0,
      }));

      setUsers(enrichedUsers);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

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
                  <TableCell>Activity</TableCell>
                  <TableCell>Portfolio Stats</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {users
                  .slice((page - 1) * resultsPerPage, page * resultsPerPage)
                  .map((user) => (
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-white">
                          <span>{user.contestCount} Contests</span>
                          <span className="text-xs text-gray-400">
                            {user.portfolioCount} Portfolios
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-white">
                          <span>₹{user.totalWinnings.toLocaleString()}</span>
                          <span className="text-xs text-gray-400">
                            Win Rate:{" "}
                            {(
                              (user.contestCount > 0
                                ? user.winCount / user.contestCount
                                : 0) * 100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge type={user.isActive ? "success" : "danger"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
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
            <Pagination
              totalResults={users.length}
              resultsPerPage={resultsPerPage}
              onChange={setPage}
              label="Users navigation"
            />
          </TableContainer>
        </CardBody>
      </Card>
    </>
  );
}

export default Users;

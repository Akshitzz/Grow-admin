import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import {
  Card,
  CardBody,
  Badge,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Button,
} from "@windmill/react-ui";
import api from "../utils/api";

// Add this safety check function
const safeArray = (arr) => (Array.isArray(arr) ? arr : []);
const safeNumber = (num) => (typeof num === 'number' ? num : 0);
const safeString = (str) => (typeof str === 'string' ? str : '');

function ContestDetails() {
  const { id } = useParams();
  const history = useHistory();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fillingBots, setFillingBots] = useState(false);

  useEffect(() => {
    // Immediately redirect if it's a create-mega route
    if (id === 'create-mega') {
      history.push('/app/contests/create');
      return;
    }

    const fetchContestDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getAdminContestDetails(id);
        
        if (!response || !response.data) {
          throw new Error("Invalid response format");
        }

        // Format dates to IST
        const contestData = {
          ...response.data,
          startDate: response.data.startDate ? new Date(response.data.startDate).toISOString() : null,
          endDate: response.data.endDate ? new Date(response.data.endDate).toISOString() : null,
          stockSelectionDeadline: response.data.stockSelectionDeadline ? new Date(response.data.stockSelectionDeadline).toISOString() : null
        };

        setContest(contestData);
      } catch (error) {
        console.error("Error fetching contest details:", error);
        setError(error.message || "Failed to load contest details");
        if (error.message.includes("unauthorized") || error.message.includes("no token")) {
          history.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [id, history]);

  const handleFillWithBots = async () => {
    try {
      setFillingBots(true);
      await api.fillWithBots(id);
      // Refresh contest details after filling with bots
      const response = await api.getAdminContestDetails(id);
      setContest(response.data);
      alert("Successfully added bots to the contest!");
    } catch (error) {
      console.error("Error filling with bots:", error);
      alert(error.message || "Failed to add bots to the contest");
    } finally {
      setFillingBots(false);
    }
  };

  // If we're redirecting, don't render anything
  // if (id === 'create-mega') {
  //   return null;
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => history.push("/app/contests")}>
          Back to Contests
        </Button>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-gray-500 mb-4">Contest not found</div>
        <Button onClick={() => history.push("/app/contests")}>
          Back to Contests
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageTitle>{contest.name}</PageTitle>

      <div className="flex justify-end mb-4">
        <Button
          onClick={handleFillWithBots}
          disabled={fillingBots || contest.participantsCount >= contest.maxParticipants}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {fillingBots ? "Adding Bots..." : "Fill with Bots"}
        </Button>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card className="text-white">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contest Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">Status</p>
                <Badge type={getStatusBadgeType(contest.status?.status || 'upcoming')}>
                  {contest.status?.status || 'upcoming'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-300">Type</p>
                <p className="font-semibold text-white">
                  {contest.type || "Standard"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Entry Fee</p>
                <p className="font-semibold text-white">₹{safeNumber(contest.entryFee)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Participants</p>
                <p className="font-semibold text-white">
                  {safeNumber(contest.participantsCount)}/{safeNumber(contest.maxParticipants)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="text-white">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 text-white">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">Start Date</p>
                <p className="font-semibold text-white">
                  {contest.startDate ? new Date(contest.startDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">End Date</p>
                <p className="font-semibold text-white">
                  {contest.endDate ? new Date(contest.endDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Selection Deadline</p>
                <p className="font-semibold text-white">
                  {contest.stockSelectionDeadline ? new Date(contest.stockSelectionDeadline).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="text-white">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Prize Pool Details
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <tr className="text-white">
                    <TableCell className="text-white">Rank</TableCell>
                    <TableCell className="text-white">Percentage</TableCell>
                    <TableCell className="text-white">Amount</TableCell>
                  </tr>
                </TableHeader>
                <TableBody className="text-white">
                  {safeArray(contest.prizePool?.distribution).map((prize) => (
                    <TableRow key={prize.rank}>
                      <TableCell className="text-white">{prize.rank}</TableCell>
                      <TableCell className="text-white">
                        {safeNumber(prize.percentage)}%
                      </TableCell>
                      <TableCell className="text-white">
                        ₹{safeNumber(prize.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>

        <Card className="md:col-span-2 text-white">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contest Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-300">Average Returns</p>
                <p className="text-xl font-bold text-white">
                  {safeNumber(contest.stats?.averageReturns).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Highest Return</p>
                <p className="text-xl font-bold text-white">
                  {safeNumber(contest.stats?.highestReturn).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Total Participants</p>
                <p className="text-xl font-bold text-white">
                  {safeNumber(contest.stats?.totalParticipants)}/{safeNumber(contest.maxParticipants)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Collected Amount</p>
                <p className="text-xl font-bold text-white">
                  ₹{safeNumber(contest.stats?.collectedAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {safeArray(contest.portfolios).length > 0 && (
          <Card className="md:col-span-2 text-white">
            <CardBody>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Participants ({contest.portfolios.length})
              </h3>
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr className="text-white">
                      <TableCell className="text-white">User</TableCell>
                      <TableCell className="text-white">Portfolio Value</TableCell>
                      <TableCell className="text-white">Returns</TableCell>
                      <TableCell className="text-white">Join Date</TableCell>
                      <TableCell className="text-white">Status</TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {safeArray(contest.portfolios).map((portfolio) => (
                      <TableRow key={portfolio._id}>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <div>
                              <p className="font-semibold text-white">
                                {portfolio.userId?.fullName || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-300">
                                @{portfolio.userId?.username || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-white">
                            ₹{safeNumber(portfolio.currentValue).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge type={safeNumber(portfolio.returns) >= 0 ? "success" : "danger"}>
                            {safeNumber(portfolio.returns).toFixed(2)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {portfolio.createdAt ? new Date(portfolio.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge type={portfolio.status === 'active' ? 'success' : 'warning'}>
                            {portfolio.status || 'pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}

function getStatusBadgeType(status) {
  switch (status) {
    case "upcoming":
      return "warning";
    case "open":
      return "success";
    case "ongoing":
      return "primary";
    case "completed":
      return "neutral";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

export default ContestDetails;

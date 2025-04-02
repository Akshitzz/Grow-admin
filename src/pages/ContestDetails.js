import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
} from "@windmill/react-ui";
import api from "../utils/api";

// Add this safety check function
const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

function ContestDetails() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);

  useEffect(() => {
    fetchContestDetails();
  }, [id]);

  const fetchContestDetails = async () => {
    try {
      setLoading(true);
      setLoadingPortfolios(true);
      const data = await api.getAdminContestDetails(id);
      setContest(data.data);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load contest details");
    } finally {
      setLoading(false);
      setLoadingPortfolios(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!contest) return <div>Contest not found</div>;

  return (
    <>
      <PageTitle>{contest.name}</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card className="text-white">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contest Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">Status</p>
                <Badge type={getStatusBadgeType(contest.status)}>
                  {contest.status}
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
                <p className="font-semibold text-white">₹{contest.entryFee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Participants</p>
                <p className="font-semibold text-white">
                  {contest.participantsCount}/{contest.maxParticipants}
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
                  {new Date(contest.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">End Date</p>
                <p className="font-semibold text-white">
                  {new Date(contest.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Selection Deadline</p>
                <p className="font-semibold text-white">
                  {new Date(
                    contest.stockSelectionDeadline
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="md:col-span-2 text-white">
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
                  {contest.prizePool?.distribution?.map((prize) => (
                    <TableRow key={prize.rank}>
                      <TableCell className="text-white">{prize.rank}</TableCell>
                      <TableCell className="text-white">
                        {prize.percentage}%
                      </TableCell>
                      <TableCell className="text-white">
                        ₹{prize.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>

        {loadingPortfolios ? (
          <Card className="md:col-span-2">
            <CardBody>
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
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
                          <TableCell className="text-white">
                            Portfolio Value
                          </TableCell>
                          <TableCell className="text-white">Returns</TableCell>
                          <TableCell className="text-white">
                            Stock Selections
                          </TableCell>
                          <TableCell className="text-white">
                            Join Date
                          </TableCell>
                          <TableCell className="text-white">Status</TableCell>
                        </tr>
                      </TableHeader>
                      <TableBody className="text-white">
                        {safeArray(contest.portfolios).map((portfolio) => (
                          <TableRow key={portfolio._id}>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <div>
                                  <p className="font-semibold text-white">
                                    {portfolio.userId?.fullName}
                                  </p>
                                  <p className="text-xs text-gray-300">
                                    @{portfolio.userId?.username}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-white">
                                ₹{portfolio.currentValue?.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                type={
                                  portfolio.returns >= 0 ? "success" : "danger"
                                }
                              >
                                {portfolio.returns?.toFixed(2)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                {portfolio.stockSelections?.map((stock) => (
                                  <Badge
                                    key={stock.symbol}
                                    type="neutral"
                                    className="text-xs"
                                  >
                                    <div className="flex flex-col items-center">
                                      <span>{stock.symbol}</span>
                                      <span className="text-xs text-gray-300">
                                        {stock.quantity} qty
                                      </span>
                                    </div>
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-white">
                                {new Date(
                                  portfolio.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                type={getPortfolioStatusType(portfolio.status)}
                              >
                                {portfolio.status}
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
          </>
        )}

        <Card className="md:col-span-2 text-white">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contest Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-300">Average Returns</p>
                <p className="text-xl font-bold text-white">
                  {contest.stats?.averageReturns?.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Highest Return</p>
                <p className="text-xl font-bold text-white">
                  {contest.stats?.highestReturn?.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Total Participants</p>
                <p className="text-xl font-bold text-white">
                  {contest.stats?.totalParticipants}/{contest.maxParticipants}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Collected Amount</p>
                <p className="text-xl font-bold text-white">
                  ₹{contest.stats?.collectedAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
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

function getPortfolioStatusType(status) {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "completed":
      return "primary";
    default:
      return "neutral";
  }
}

export default ContestDetails;

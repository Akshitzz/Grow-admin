import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Badge,
  Card,
  CardBody,
} from "@windmill/react-ui";

function ContestDetails() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContestDetails();
  }, [id]);

  const fetchContestDetails = async () => {
    try {
      const response = await fetch(`/api/contests/${id}`);
      const data = await response.json();
      setContest(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contest details:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!contest) {
    return <div>Contest not found</div>;
  }

  return (
    <>
      <PageTitle>Contest Details</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="mb-4 font-semibold text-gray-600">
              Basic Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-lg font-semibold">{contest.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <Badge type={contest.type === "STOCK" ? "primary" : "warning"}>
                  {contest.type}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Entry Fee</p>
                <p className="text-lg font-semibold">₹{contest.entryFee}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Prize Pool</p>
                <p className="text-lg font-semibold">
                  ₹{contest.prizePool.totalAmount}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="mb-4 font-semibold text-gray-600">Contest Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge type={getStatusBadgeType(contest.status)}>
                  {contest.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Participants
                </p>
                <p className="text-lg font-semibold">
                  {contest.participantsCount}/{contest.maxParticipants}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Start Date</p>
                <p className="text-sm">
                  {new Date(contest.duration.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">End Date</p>
                <p className="text-sm">
                  {new Date(contest.duration.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-600">
        Prize Distribution
      </h2>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Rank</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Amount</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {contest.prizePool.distribution.map((prize) => (
              <TableRow key={prize.rank}>
                <TableCell>{prize.rank}</TableCell>
                <TableCell>{prize.percentage}%</TableCell>
                <TableCell>₹{prize.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

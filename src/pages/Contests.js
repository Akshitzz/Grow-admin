import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
} from "@windmill/react-ui";
import { useHistory, useParams } from "react-router-dom";
import api from "../utils/api";

function Contests() {
  const history = useHistory();
  const { leagueId } = useParams();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // const API_URL = process.env.API_URL || "https://growupp.onrender.com/api";
  // const API_URL = process.env.API_URL || "http://localhost:3000/api";

  useEffect(() => {
    fetchContests();
  }, [leagueId, page]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.getAdminContests();
      setContests(data.data);
    } catch (error) {
      console.error("Error fetching contests:", error);
      setError(error.message);
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContest = (id) => {
    history.push(`/app/contests/${id}`);
  };

  const handleEditContest = (id) => {
    history.push(`/app/contests/edit/${id}`);
  };

  const handleCreateContest = () => {
    history.push("/app/contests/create");
  };

  return (
    <>
      <PageTitle>Contests</PageTitle>

      <div className="flex justify-between mb-8">
        <div>
          <Button onClick={handleCreateContest}>Create New Contest</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4 bg-red-100 rounded">
          {error}
        </div>
      ) : !contests || contests.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <p>No contests found</p>
          <Button className="mt-4" onClick={handleCreateContest}>
            Create Your First Contest
          </Button>
        </div>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Entry Fee</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Prize Pool</TableCell>
                <TableCell>Leaderboard</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {Array.isArray(contests) &&
                contests.map((contest) => (
                  <TableRow key={contest._id}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">{contest.name}</p>
                          <p className="text-xs text-gray-600">
                            {contest.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        type={contest.type === "STOCK" ? "primary" : "warning"}
                      >
                        {contest.type || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{contest.entryFee}</TableCell>
                    <TableCell>
                      {contest.participantsCount || 0}/{contest.maxParticipants}
                    </TableCell>
                    <TableCell>
                      <Badge type={getStatusBadgeType(contest.status?.status || 'upcoming')}>
                        {contest.status?.status || 'upcoming'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        if (!contest.prizePool) return '₹0';
                        if (typeof contest.prizePool === 'object' && contest.prizePool.totalAmount) {
                          return `₹${contest.prizePool.totalAmount}`;
                        }
                        if (typeof contest.status === 'object' && contest.status.totalPrizePool) {
                          return `₹${contest.status.totalPrizePool}`;
                        }
                        return `₹${contest.entryFee * contest.maxParticipants}`;
                      })()}
                    </TableCell>
                    <TableCell>
                      {contest.participants?.length || 0}
                    </TableCell>
                    <TableCell>
                      {contest.status?.averageReturns || 0}%
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          layout="link"
                          size="small"
                          onClick={() => handleViewContest(contest._id)}
                        >
                          View
                        </Button>
                        <Button 
                          layout="link" 
                          size="small"
                          onClick={() => handleEditContest(contest._id)}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={100}
              resultsPerPage={10}
              onChange={setPage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      )}
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

export default Contests;

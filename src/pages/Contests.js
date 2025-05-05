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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  const [totalResults, setTotalResults] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [contestToDelete, setContestToDelete] = useState(null);
  const resultsPerPage = 10;

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
      if (!data || !data.data) {
        throw new Error("Invalid response format");
      }

      // Calculate pagination
      const startIndex = (page - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;
      const paginatedContests = data.data.slice(startIndex, endIndex);
      
      setContests(paginatedContests);
      setTotalResults(data.data.length);
    } catch (error) {
      console.error("Error fetching contests:", error);
      setError(error.message);
      setContests([]);
      setTotalResults(0);
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

  const handleDeleteClick = (contest) => {
    setContestToDelete(contest);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deleteContest(contestToDelete._id);
      setContests(contests.filter(contest => contest._id !== contestToDelete._id));
      setDeleteModal(false);
      setContestToDelete(null);
      alert("Contest deleted successfully");
    } catch (error) {
      console.error("Error deleting contest:", error);
      alert(`Error deleting contest: ${error.message}`);
    }
  };

  return (
    <>
      <PageTitle>Contests</PageTitle>

      <div className="flex justify-between mb-8">
        <div className="space-x-4">
          <Button onClick={handleCreateContest}>Create Contest</Button>
          <Button onClick={() => history.push("/app/contests/create-mega")}>
            Create Mega Contest
          </Button>
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
                        <Button
                          layout="link"
                          size="small"
                          onClick={() => handleDeleteClick(contest)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={setPage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      )}

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the contest "{contestToDelete?.name}"? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
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

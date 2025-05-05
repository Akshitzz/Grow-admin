import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Card,
  CardBody,
} from "@windmill/react-ui";
import api from "../utils/api";

function Teams() {
  const [allTeams, setAllTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    fetchTeams();
  }, []); // Only fetch on initial load

  useEffect(() => {
    // Update paginated teams when page changes
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    setTeams(allTeams.slice(startIndex, endIndex));
  }, [page, allTeams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminTeams();
      if (!response || !response.data) {
        throw new Error("Invalid response format");
      }

      setAllTeams(response.data);
      setTotalResults(response.data.length);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load teams");
      setAllTeams([]);
      setTeams([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-32 h-32 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
        <Button onClick={fetchTeams} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageTitle>Recent Teams</PageTitle>

      <Card className="mb-8">
        <CardBody>
          <TableContainer>
            <Table>
              <TableHeader>
                <tr className="">
                  <TableCell className="">User</TableCell>
                  <TableCell className="">Contest</TableCell>
                  <TableCell className="">Captain</TableCell>
                  <TableCell className="">Vice Captain</TableCell>
                  <TableCell className="">Type</TableCell>
                  <TableCell className="">Status</TableCell>
                  <TableCell className="">Created At</TableCell>
                  <TableCell className="">Actions</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team._id} className="">
                    <TableCell>
                      <div className="flex flex-col ">
                        <span className="text-sm">
                          {team.userId?.fullName}
                        </span>
                        <span className="text-xs text-gray-300">
                          @{team.userId?.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col ">
                        <span className="text-sm">
                          {team.contestId?.name}
                        </span>
                        <span className="text-xs text-gray-300">
                          Entry: ₹{team.contestId?.entryFee}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{team.captain}</TableCell>
                    <TableCell className="text-sm">
                      {team.viceCaptain}
                    </TableCell>
                    <TableCell>
                      <Badge
                        type={team.type === "STOCK" ? "primary" : "warning"}
                      >
                        {team.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        type={
                          team.status === "active" ? "success" : "neutral"
                        }
                      >
                        {team.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(team.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        layout="link"
                        size="small"
                        className=""
                        onClick={() => {
                          /* Show team details modal */
                        }}
                      >
                        View Details
                      </Button>
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
                label="Team navigation"
              />
            </TableFooter>
          </TableContainer>
        </CardBody>
      </Card>
    </>
  );
}

export default Teams;

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
} from "@windmill/react-ui";
import api from "../utils/api";

function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const response = await api.getLeagues();
      setLeagues(response.data);
    } catch (error) {
      console.error("Error fetching leagues:", error);
    }
  };

  return (
    <>
      <PageTitle>Leagues</PageTitle>

      <div className="flex justify-between mb-8">
        <Button onClick={() => history.push("/app/leagues/create")}>
          Create New League
        </Button>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {leagues.map((league) => (
              <TableRow key={league._id}>
                <TableCell>
                  <span className="text-sm">{league.name}</span>
                </TableCell>
                <TableCell>
                  <Badge type={league.type === "STOCK" ? "primary" : "warning"}>
                    {league.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    type={league.status === "active" ? "success" : "danger"}
                  >
                    {league.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    layout="link"
                    onClick={() => history.push(`/app/leagues/${league._id}`)}
                  >
                    View Contests
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Leagues;

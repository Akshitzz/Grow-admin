import React, { useState, useEffect } from 'react';
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
} from '@windmill/react-ui';
import { EditIcon, TrashIcon } from '../icons';
import api from '../utils/api';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [page]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getLeaderboard(page);
      
      // Ensure we have an array of data
      const data = Array.isArray(response) ? response : [];
      setLeaderboardData(data);
      setTotalResults(data.length);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard data');
      setLeaderboardData([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-6 mx-auto grid">
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Leaderboard
      </h2>

      {error && (
        <div className="mb-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Contest</TableCell>
              <TableCell>League</TableCell>
              <TableCell>Winnings</TableCell>
              <TableCell>Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : leaderboardData.length === 0 ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              leaderboardData.map((entry, index) => (
                <TableRow key={entry.id || index}>
                  <TableCell>
                    <span className="text-sm">#{index + 1}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{entry.userName || 'Unknown User'}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {entry.userPhone || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{entry.contestName || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{entry.leagueName || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge type="success">₹{entry.winnings || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={10}
            onChange={setPage}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
}

export default Leaderboard; 
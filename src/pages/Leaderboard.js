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
import api from '../utils/api';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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
      
      if (response.success) {
        setLeaderboardData(response.data || []);
        setTotalResults(response.pagination?.totalUsers || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        throw new Error('Failed to fetch leaderboard data');
      }
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
              <TableCell>Total Winnings</TableCell>
              <TableCell>Contests Won</TableCell>
              <TableCell>Contests Joined</TableCell>
              <TableCell>Win Rate</TableCell>
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
                <TableRow key={entry.username || index}>
                  <TableCell>
                    <span className="text-sm">#{index + 1}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{entry.fullName || 'Unknown User'}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          @{entry.username || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge type="success">₹{entry.totalWinnings || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{entry.totalContestsWon || 0}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{entry.totalContestsJoined || 0}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{entry.winRate || 0}%</span>
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
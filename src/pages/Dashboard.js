import React, { useState, useEffect } from "react";
import { Card, CardBody, Badge } from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import api from "../utils/api";

function Dashboard() {
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      portfolios: 0,
      totalContests: 0,
      activeContests: 0,
      leagues: 0,
    },
    contestTypes: [
      { name: "Active", value: 45 },
      { name: "Upcoming", value: 30 },
      { name: "Completed", value: 25 },
    ],
    recentActivity: {
      contests: [],
      teams: [],
    },
  });

  const COLORS = ["#0088FE", "#00C49F", "#FF8042"];
  const STATUS_COLORS = {
    active: "green",
    upcoming: "blue",
    completed: "gray",
    cancelled: "red",
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.getDashboardStats();
      // Merge dummy contest distribution data with real stats
      setStats((prev) => ({
        ...response,
        contestTypes: [
          { name: "Active", value: response.counts?.activeContests || 45 },
          { name: "Upcoming", value: 30 },
          {
            name: "Completed",
            value:
              response.counts?.totalContests -
                (response.counts?.activeContests || 0) || 25,
          },
        ],
      }));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded shadow text-white border border-gray-700">
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-purple-600">
          <CardBody>
            <p className="mb-4 font-semibold text-white">Total Users</p>
            <p className="text-2xl font-bold text-white">
              {stats.counts.users}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-green-600">
          <CardBody>
            <p className="mb-4 font-semibold text-white">Active Contests</p>
            <p className="text-2xl font-bold text-white">
              {stats.counts.activeContests}
            </p>
            <p className="text-sm text-white">
              of {stats.counts.totalContests} total
            </p>
          </CardBody>
        </Card>

        <Card className="bg-blue-600">
          <CardBody>
            <p className="mb-4 font-semibold text-white">Total Teams</p>
            <p className="text-2xl font-bold text-white">
              {stats.counts.portfolios}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-red-600">
          <CardBody>
            <p className="mb-4 font-semibold text-white">Total Leagues</p>
            <p className="text-2xl font-bold text-white">
              {stats.counts.leagues}
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-white">
              Contest Distribution
            </p>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.contestTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {stats.contestTypes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-white">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-white">Recent Contests</p>
            <div className="space-y-4">
              {stats.recentActivity.contests.map((contest) => (
                <div
                  key={contest._id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {contest.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {contest.participantCount} participants • ₹
                      {contest.entryFee}
                    </p>
                  </div>
                  <Badge className="bg-white" type={STATUS_COLORS[contest.status]}>
                    {contest.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardBody>
            <p className="mb-4 font-semibold text-white">Recent Teams</p>
            <div className="space-y-4">
              {stats.recentActivity.teams.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {entry.user?.fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      @{entry.user?.username}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{entry.contest?.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Dashboard;

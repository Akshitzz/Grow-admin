import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import api from "../utils/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalContests: 0,
    activeContests: 0,
    totalPortfolios: 0,
    totalVolume: 0,
    monthlyData: [],
    contestTypes: [],
    userGrowth: [],
    revenueData: [],
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Simulate data since actual API isn't returning all stats
      const baseData = await api.getDashboardStats();

      // Enrich the data
      const monthlyData = generateMonthlyData();
      const contestTypes = generateContestTypes();
      const userGrowth = generateUserGrowth();
      const revenueData = generateRevenueData();

      setStats({
        ...baseData,
        monthlyData,
        contestTypes,
        userGrowth,
        revenueData,
        totalVolume: calculateTotalVolume(),
        totalPortfolios: calculateTotalPortfolios(),
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Helper functions to generate mock data
  const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      name: month,
      users: Math.floor(Math.random() * 1000),
      contests: Math.floor(Math.random() * 100),
      revenue: Math.floor(Math.random() * 100000),
    }));
  };

  const generateContestTypes = () => [
    { name: "Stock", value: 45 },
    { name: "Crypto", value: 30 },
    { name: "Forex", value: 15 },
    { name: "Commodity", value: 10 },
  ];

  const generateUserGrowth = () => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      data.push({
        day: `Day ${i + 1}`,
        users: Math.floor(Math.random() * 100) + 50,
      });
    }
    return data;
  };

  const generateRevenueData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        month: `Month ${i + 1}`,
        revenue: Math.floor(Math.random() * 100000),
      });
    }
    return data;
  };

  const calculateTotalVolume = () => Math.floor(Math.random() * 1000000);
  const calculateTotalPortfolios = () => Math.floor(Math.random() * 10000);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-purple-600">
          <CardBody className="flex items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-white">Total Users</p>
              <p className="text-lg font-semibold text-white">
                {stats.totalUsers}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-green-600">
          <CardBody className="flex items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-white">
                Total Volume
              </p>
              <p className="text-lg font-semibold text-white">
                ₹{stats.totalVolume?.toLocaleString()}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-blue-600">
          <CardBody className="flex items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-white">
                Active Contests
              </p>
              <p className="text-lg font-semibold text-white">
                {stats.activeContests}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-red-600">
          <CardBody className="flex items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-white">
                Total Portfolios
              </p>
              <p className="text-lg font-semibold text-white">
                {stats.totalPortfolios}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-200">Monthly Overview</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937" }} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-200">
              Contest Distribution
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.contestTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.contestTypes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardBody>
            <p className="mb-4 font-semibold text-gray-200">Revenue Trend</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937" }} />
                  <Bar dataKey="revenue" fill="#0694a2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Dashboard;

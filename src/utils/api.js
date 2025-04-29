const API_URL = process.env.API_URL || "https://api.market11.in/api";
// const API_URL = "http://localhost:3000/api";

export const apiCall = async (endpoint, options = {}) => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API call failed");
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export default {
  getContests: (page) => {
    console.log("Fetching contests for page:", page);
    return apiCall(`/contests`);
  },
  createContest: (data) => {
    // Helper to subtract 5 hours 30 minutes
    const subtractFiveAndHalfHours = (dateStr) => {
      if (!dateStr) return dateStr;
      const date = new Date(dateStr);
      // Subtract 5 hours 30 minutes in ms
      date.setTime(date.getTime() - (5 * 60 + 30) * 60 * 1000);
      return date.toISOString(); // or keep the original format if needed
    };

    const formattedData = {
      ...data,
      leagueId: data.leagueId, // Add league ID
      startDate: subtractFiveAndHalfHours(data.startDate),
      endDate: subtractFiveAndHalfHours(data.endDate),
      stockSelectionDeadline: subtractFiveAndHalfHours(data.stockSelectionDeadline),
    };

    console.log(
      "Sending contest data with correct field names:",
      formattedData
    );

    return apiCall("/contests/create", {
      method: "POST",
      body: JSON.stringify(formattedData),
    });
  },
  getContestDetails: (id) => apiCall(`/contests/${id}`),
  updateContest: (id, data) =>
    apiCall(`/contests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getLeagues: () => apiCall("/leagues"),
  createLeague: (data) =>
    apiCall("/leagues/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getLeagueDetails: (id) => apiCall(`/leagues/${id}`),
  sendOTP: (phoneNumber) =>
    apiCall("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    }),
  verifyOTP: (phoneNumber, otp) =>
    apiCall("/auth/admin/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, otp }),
    }),
  getAllUsers: () =>
    apiCall("/admin/users", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    }),
  getUserDetails: (id) => apiCall(`/admin/users/${id}`),
  updateUser: (id, data) =>
    apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Admin specific methods
  getAdminContests: () => apiCall("/admin/contests"),
  getAdminContestDetails: (id) => apiCall(`/admin/contests/${id}`),
  updateAdminContest: (id, data) =>
    apiCall(`/admin/contests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getAdminTeams: () => apiCall("/admin/teams"),
  getDashboardStats: () => apiCall("/admin/dashboard/stats"),
};

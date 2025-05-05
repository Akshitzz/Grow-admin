const API_URL = process.env.API_URL || "https://api.market11.in/api";
// const API_URL = "http://localhost:3000/api";

export const apiCall = async (endpoint, options = {}) => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // Skip Authorization header for login endpoint
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Only add Authorization header if we have a token and it's not a login request
    if (token && !endpoint.includes("/auth/admin/login")) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
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
    const formattedData = {
      ...data,
      leagueId: data.leagueId,
      startDate: data.startDate,
      endDate: data.endDate,
      stockSelectionDeadline: data.stockSelectionDeadline,
      megaContest: data.megaContest || false,
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
    
    deleteUser: (id) =>
      apiCall(`/admin/users/${id}`, {
        method: "DELETE",
      }),
    BlockUser: (id) =>
      apiCall(`/admin/users/${id}/block`, {
        method: "PATCH",
      }),
  getAdminContests: () => apiCall("/admin/contests"),
  getAdminContestDetails: async (id) => {
    try {
      const response = await apiCall(`/admin/contests/${id}`);
      // Check if response exists and has data property
      if (!response) {
        throw new Error("No response from server");
      }
      // If response is already in the correct format (has data property), return it
      if (response.data) {
        return response;
      }
      // If response is the data itself, wrap it in a data property
      return { data: response };
    } catch (error) {
      console.error("Error in getAdminContestDetails:", error);
      // Check if error is from the API response
      if (error.response) {
        throw new Error(error.response.message || "Failed to fetch contest details");
      }
      // Check if error is from network or other issues
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch contest details");
    }
  },
  updateAdminContest: (id, data) =>
    apiCall(`/admin/contests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getAdminTeams: () => apiCall("/admin/teams"),
  getDashboardStats: () => apiCall("/admin/dashboard/stats"),
  deleteContest: (id) =>
    apiCall(`/admin/contests/${id}`, {
      method: "DELETE",
    }),

  // Leaderboard endpoints
  getLeaderboard: async (page = 1) => {
    try {
      const response = await apiCall(`/leaderboard?page=${page}`);
      console.log('Leaderboard API Response:', response);
      return response;
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      throw error;
    }
  },

  // Contest and League management
  updateLeague: async (leagueId, leagueData) => {
    const response = await fetch(`${API_URL}/api/leagues/${leagueId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leagueData),
    });
    const responseData = await response.json();
    return responseData;
  },

  deleteLeague: async (leagueId) => {
    const response = await fetch(`${API_URL}/api/leagues/${leagueId}`, {
      method: "DELETE",
    });
    const responseData = await response.json();
    return responseData;
  },

  // Add login endpoint
  login: (credentials) =>
    apiCall("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
};

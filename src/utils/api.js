const API_URL = process.env.API_URL || "http://localhost:3000/api";

export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
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
    const formattedData = {
      ...data,
      leagueId: data.leagueId, // Add league ID
      startDate: data.startDate,
      endDate: data.endDate,
      stockSelectionDeadline: data.stockSelectionDeadline,
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
};

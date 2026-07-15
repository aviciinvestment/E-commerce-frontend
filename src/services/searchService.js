import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com";

const searchClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const fetchSearchSuggestionsAPI = async (keyword) => {
  // Hits your partial index route to fetch key match strings for autocompletion
  const response = await searchClient.get("/products/getAllProducts", {
    params: { search: keyword, limit: 5 },
  });
  return response.data.data || [];
};

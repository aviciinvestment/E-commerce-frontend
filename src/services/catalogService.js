import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com";

const catalogClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const fetchFilteredProductsAPI = async (params) => {
  // Converted params to query string: ?category=id&sort=price_asc&page=1&limit=8
  const response = await catalogClient.get("/products/getAllProducts", {
    params,
  });
  return response.data;
};

export const fetchSingleCategoryAPI = async (categoryId) => {
  const response = await catalogClient.get(`/api/categories/${categoryId}`);
  return response.data;
};

import axios from "axios";

// ⚠️ Mounted at /review (singular), routes defined as /reviews/... (plural)
// → real path: /review/reviews/add, /review/reviews/update, etc.
const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com/review";

const reviewClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

reviewClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createReviewAPI = async (userId, productId, rating, comment) => {
  const response = await reviewClient.post("/reviews/add", {
    userId,
    productId,
    rating,
    comment,
  });
  return response.data;
};

export const updateReviewAPI = async (reviewId, userId, rating, comment) => {
  const response = await reviewClient.put("/reviews/update", {
    reviewId,
    userId,
    rating,
    comment,
  });
  return response.data;
};

export const deleteReviewAPI = async (reviewId, userId) => {
  const response = await reviewClient.post("/reviews/delete", {
    reviewId,
    userId,
  });
  return response.data;
};

export const getProductReviewsAPI = async (productId) => {
  const response = await reviewClient.get(`/reviews/product/${productId}`);
  return response.data;
};

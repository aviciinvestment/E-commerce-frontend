import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com";

const homeClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const fetchHomepagePayloadAPI = async () => {
  // Parallel resolution reads public inventories simultaneously
  const [categoriesRes, productsRes] = await Promise.all([
    homeClient.get("/categories"),
    homeClient.get("/products"),
  ]);

  const allProducts = productsRes.data.data || [];

  return {
    categories: categoriesRes.data.data || [],
    featured: allProducts.slice(0, 4), // Dynamic slicing for homepage segments
    newArrivals: allProducts
      .filter((p) => p.stockCount > 0)
      .slice(-4)
      .reverse(),
    bestSellers: allProducts
      .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      .slice(0, 4),
    flashSale: allProducts.filter((p) => p.price < 500).slice(0, 2),
  };
};

export const subscribeNewsletterAPI = async (email) => {
  const response = await homeClient.post("/newsletter/subscribe", { email });
  return response.data;
};

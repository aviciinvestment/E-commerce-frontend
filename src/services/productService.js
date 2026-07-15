import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com";

const productClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const fetchProductDetailsAPI = async (productId) => {
  // Parallel resolution pulls core product asset data and related items concurrently
  const detailRes = await productClient.get(
    `/products/getSingleProduct/:${productId}`,
  );
  const currentProduct = detailRes.data.data;

  // Fetch recommendations based on category context
  const relatedRes = await productClient.get("/products/getAllProducts", {
    params: { categoryId: currentProduct.categoryId, limit: 4 },
  });

  return {
    product: currentProduct,
    relatedProducts: (relatedRes.data.data || []).filter(
      (p) => p._id !== productId,
    ),
  };
};

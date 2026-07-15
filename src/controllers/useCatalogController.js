import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchFilteredProductsAPI } from "../services/catalogService";

export const useCatalogController = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  // ⚡ PARSE ALL 6 BACKEND FILTER MATRIX PARAMETERS FROM THE URL BAR
  const searchFilter = searchParams.get("search") || "";
  const sortFilter = searchParams.get("sort") || "-createdAt"; // Backend format e.g. -price
  const minPriceFilter = searchParams.get("minPrice") || "";
  const maxPriceFilter = searchParams.get("maxPrice") || "";
  const pageFilter = parseInt(searchParams.get("page")) || 1;
  const limitFilter = parseInt(searchParams.get("limit")) || 8;

  useEffect(() => {
    const syncCatalog = async () => {
      setLoading(true);
      try {
        // Compile the variables explicitly into a backend-ready configuration payload object
        const queryParams = {
          page: pageFilter,
          limit: limitFilter,
          search: searchFilter,
          sort: sortFilter,
          minPrice: minPriceFilter,
          maxPrice: maxPriceFilter,
        };

        const res = await fetchFilteredProductsAPI(queryParams);
        setProducts(res.data || []);

        // Dynamically tracking pagination matrices based on backend return frames
        setPagination({
          totalPages: res.totalPages || 1,
          currentPage: res.page || 1,
        });
      } catch (err) {
        console.error("Catalog matrix load failure:", err.message);
      } finally {
        setLoading(false);
      }
    };

    syncCatalog();
  }, [
    searchFilter,
    sortFilter,
    minPriceFilter,
    maxPriceFilter,
    pageFilter,
    limitFilter,
  ]);

  // Method to easily adjust filters individually without breaking current states
  const updateFilters = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    // Resets page context back to 1 on parameter adjustments to prevent grid out-of-bounds crashes
    setSearchParams({ ...current, ...newParams, page: 1 });
  };

  const handlePageChange = (targetPage) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, page: targetPage });
  };

  return {
    products,
    loading,
    pagination,
    searchFilter,
    sortFilter,
    minPriceFilter,
    maxPriceFilter,
    updateFilters,
    handlePageChange,
  };
};

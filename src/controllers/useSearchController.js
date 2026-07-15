import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSearchSuggestionsAPI } from "../services/searchService";

export const useSearchController = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const [recentSearches, setRecentSearches] = useState(() => {
    return JSON.parse(localStorage.getItem("recentSearches")) || [];
  });

  // ⚡ DYNAMIC INPUT TRACKER: Handles clear states synchronously inside
  // the event layer instead of dumping empty arrays into your useEffect lifecycle.
  const handleQueryChange = (newValue) => {
    setQuery(newValue);
    if (newValue.trim().length < 2) {
      setSuggestions([]); // Safely handles UI flush outside the layout effect loop
    }
  };

  useEffect(() => {
    if (query.trim().length < 2) return; // Silent return block prevents render loops

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const matches = await fetchSearchSuggestionsAPI(query);
        setSuggestions(matches);
      } catch (err) {
        console.error("Autocomplete failure:", err.message);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms network shielding buffer window

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const executeSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;

    const updatedHistory = [
      searchTerm.trim(),
      ...recentSearches.filter(
        (s) => s.toLowerCase() !== searchTerm.trim().toLowerCase(),
      ),
    ].slice(0, 5);

    setRecentSearches(updatedHistory);
    localStorage.setItem("recentSearches", JSON.stringify(updatedHistory));

    setIsFocused(false);
    setQuery("");
    navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return {
    query,
    handleQueryChange, // ⚡ Fed back to the UI input event listener
    suggestions,
    loading,
    isFocused,
    setIsFocused,
    recentSearches,
    executeSearch,
    clearHistory,
  };
};

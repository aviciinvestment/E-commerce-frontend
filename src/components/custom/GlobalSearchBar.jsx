//import React from "react";
import { useSearchController } from "../../controllers/useSearchController";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Clock,
  Sparkles,
  Trash2,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

export const GlobalSearchBar = () => {
  const {
    query,
    handleQueryChange,
    suggestions,
    loading,
    isFocused,
    setIsFocused,
    recentSearches,
    executeSearch,
    clearHistory,
  } = useSearchController();

  return (
    <div className="relative w-full max-w-md z-50">
      {/* 8. SEARCH INPUT BAR CONTAINER */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeSearch(query);
        }}
        className="relative flex items-center"
      >
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search catalog assets (e.g. Arduino)..."
          className="pl-9 pr-8 text-xs h-9 bg-slate-50 focus-visible:ring-indigo-500 focus-visible:bg-white transition-all w-full"
          value={query}
          /* ⚡ UPDATED: Feeds directly into the optimized change handler engine */
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {loading && (
          <Loader2 className="absolute right-3 h-3.5 w-3.5 animate-spin text-slate-400" />
        )}
      </form>

      {/* 8. DYNAMIC OVERLAY SUGGESTIONS DROPDOWN PANEL */}
      {isFocused && (query.length > 0 || recentSearches.length > 0) && (
        <Card className="absolute top-11 left-0 right-0 bg-white border border-slate-200/80 shadow-lg rounded-xl overflow-hidden animate-in slide-in-from-top-1 duration-150">
          {/* Section A: Recent Searches Tracking Grid */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-3 border-b border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <span>Recent Search Metrics</span>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-500 bg-transparent border-0 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear History
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => executeSearch(term)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-md border border-slate-200/40 transition-colors font-medium cursor-pointer"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section B: Live Instantly Filtered Index Matches */}
          {query.length >= 2 && (
            <div className="py-1">
              <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Catalog Autocomplete Suggestions
              </div>

              {suggestions.length === 0 && !loading ? (
                <div className="px-3 py-3 text-xs text-slate-400 font-medium">
                  No direct string index matches found.
                </div>
              ) : (
                suggestions.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => executeSearch(item.name)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left border-0 bg-transparent cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate capitalize">{item.name}</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                ))
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

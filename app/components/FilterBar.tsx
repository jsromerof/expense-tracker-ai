"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { FilterState, CATEGORIES, Category } from "../types/expense";

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export default function FilterBar({ filters, onChange }: Props) {
  const hasActiveFilters =
    filters.category !== "All" ||
    filters.search !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  function clear() {
    onChange({ search: "", category: "All", dateFrom: "", dateTo: "" });
  }

  return (
    <div className="space-y-3">
      {/* Search + clear */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search expenses…"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={clear}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Category + date range */}
      <div className="flex flex-wrap gap-2">
        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...CATEGORIES] as (Category | "All")[]).map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, category: cat })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filters.category === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            title="From date"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            title="To date"
          />
        </div>
      </div>
    </div>
  );
}

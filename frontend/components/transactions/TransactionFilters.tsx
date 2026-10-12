"use client";

import React, { memo } from "react";
import { Search, ArrowUpDown } from "lucide-react";

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterType: "all" | "income" | "expense";
  onFilterChange: (type: "all" | "income" | "expense") => void;
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
  onSortChange: (sort: "date-desc" | "date-asc" | "amount-desc" | "amount-asc") => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          {(["all", "income", "expense"] as const).map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                filterType === type
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {type === "all" ? "All Types" : type}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e: any) => onSortChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default memo(TransactionFilters);


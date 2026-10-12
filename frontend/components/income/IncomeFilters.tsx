"use client";

import React, { memo } from "react";
import { Search, Filter } from "lucide-react";
import { INCOME_CATEGORY_CONSTANTS } from "@/utils/constants";

interface IncomeFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
}

const IncomeFilters: React.FC<IncomeFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative flex-1 w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search income sources..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium"
        />
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Sources</option>
          {INCOME_CATEGORY_CONSTANTS.map((cat) => (
            <option key={cat.value} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default memo(IncomeFilters);


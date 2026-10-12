"use client";

import React, { memo } from "react";
import { TrendingDown, Tag, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/utils/helpers";

interface ExpenseMetricsProps {
  totalSpent: number;
  itemCount: number;
  avgExpense: number;
}

const ExpenseMetrics: React.FC<ExpenseMetricsProps> = ({
  totalSpent,
  itemCount,
  avgExpense,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Expenses
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-rose-600 mt-2">
          -{formatCurrency(totalSpent)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Transactions
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Tag className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 mt-2">
          {itemCount} items
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Average Expense
          </span>
          <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 mt-2">
          {formatCurrency(avgExpense)}
        </div>
      </div>
    </div>
  );
};

export default memo(ExpenseMetrics);


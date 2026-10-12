"use client";

import React, { memo } from "react";
import { TrendingUp, Tag, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/utils/helpers";

interface IncomeMetricsProps {
  totalEarned: number;
  itemCount: number;
  avgIncome: number;
}

const IncomeMetrics: React.FC<IncomeMetricsProps> = ({
  totalEarned,
  itemCount,
  avgIncome,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Inflow
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-emerald-600 mt-2">
          +{formatCurrency(totalEarned)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Income Records
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
            Average Stream
          </span>
          <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 mt-2">
          {formatCurrency(avgIncome)}
        </div>
      </div>
    </div>
  );
};

export default memo(IncomeMetrics);


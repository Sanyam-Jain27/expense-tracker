"use client";

import React, { memo } from "react";
import Highcharts from "highcharts";
import { TrendingUp } from "lucide-react";
import DynamicChart from "@/components/shared/DynamicChart";

interface CashFlowChartProps {
  options: Highcharts.Options | null;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ options }) => {
  return (
    <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Monthly Cash Flow
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Income vs Expenses comparison across months
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Inflow
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Outflow
          </span>
        </div>
      </div>

      {options ? (
        <DynamicChart options={options} />
      ) : (
        <div className="h-72 flex flex-col items-center justify-center text-slate-400 gap-2">
          <TrendingUp className="w-8 h-8 text-slate-300" />
          <span className="text-sm font-medium">
            No cash flow records yet
          </span>
        </div>
      )}
    </div>
  );
};

export default memo(CashFlowChart);


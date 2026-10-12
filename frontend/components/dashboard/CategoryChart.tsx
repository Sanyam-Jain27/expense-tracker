"use client";

import React, { memo } from "react";
import Highcharts from "highcharts";
import { PieChart as PieIcon } from "lucide-react";
import DynamicChart from "@/components/shared/DynamicChart";

interface CategoryChartProps {
  options: Highcharts.Options | null;
  hasData: boolean;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ options, hasData }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Spending by Category
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Breakdown of expenses by category
        </p>
      </div>

      <div className="my-auto py-2">
        {hasData && options ? (
          <DynamicChart options={options} />
        ) : (
          <div className="h-72 flex flex-col items-center justify-center text-slate-400 gap-2">
            <PieIcon className="w-8 h-8 text-slate-300" />
            <span className="text-sm font-medium">
              No category records yet
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CategoryChart);


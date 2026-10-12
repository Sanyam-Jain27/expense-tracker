"use client";

import React, { memo } from "react";
import Highcharts from "highcharts";
import DynamicChart from "@/components/shared/DynamicChart";
import { ChartTypes } from "@/utils/types";

interface TransactionTimelineChartProps {
  options: Highcharts.Options | null;
  chartType: ChartTypes;
  onToggleChartType: () => void;
}

const TransactionTimelineChart: React.FC<TransactionTimelineChartProps> = ({
  options,
  chartType,
  onToggleChartType,
}) => {
  if (!options) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Activity Timeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological visualization of incoming and outgoing funds
          </p>
        </div>
        <button
          className="self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          onClick={onToggleChartType}
        >
          Switch to {chartType === "column" ? "Line View" : "Bar View"}
        </button>
      </div>
      <div className="mt-4">
        <DynamicChart options={options} />
      </div>
    </div>
  );
};

export default memo(TransactionTimelineChart);


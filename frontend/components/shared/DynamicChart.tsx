"use client";

import dynamic from "next/dynamic";
import Highcharts from "highcharts";
import React, { memo } from "react";

// Dynamically load HighchartsReact on client side to avoid heavy initial bundle blocking
const HighchartsReactComponent = dynamic(
  () => import("highcharts-react-official"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-slate-50/50 rounded-xl animate-pulse">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin mb-2" />
        <span className="text-xs text-slate-400 font-medium">Loading visualization...</span>
      </div>
    ),
  }
);

interface DynamicChartProps {
  options: Highcharts.Options | null;
  className?: string;
}

const DynamicChart: React.FC<DynamicChartProps> = ({ options, className }) => {
  if (!options) return null;

  return (
    <div className={className}>
      <HighchartsReactComponent
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default memo(DynamicChart);


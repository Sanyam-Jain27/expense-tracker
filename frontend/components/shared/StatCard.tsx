"use client";

import React, { memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  color?: string;
  bg?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  color = "text-indigo-600",
  bg = "bg-indigo-50",
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={cn("p-2.5 rounded-xl", bg, color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {subtext && (
          <div className="text-xs font-medium text-slate-500 mt-1">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(StatCard);


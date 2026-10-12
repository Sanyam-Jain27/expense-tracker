"use client";

import React, { memo } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = "h-48",
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-slate-400 gap-3 border border-dashed border-slate-200 rounded-2xl p-6 ${className}`}
    >
      {Icon && <Icon className="w-8 h-8 text-slate-300" />}
      <span className="text-sm font-medium text-slate-500">{title}</span>
      {description && (
        <span className="text-xs text-slate-400 -mt-1 text-center max-w-sm">
          {description}
        </span>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default memo(EmptyState);


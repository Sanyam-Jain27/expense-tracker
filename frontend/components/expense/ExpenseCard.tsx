"use client";

import React, { memo } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { ITransactionData } from "@/utils/types";
import { formatCurrency, formatDate } from "@/utils/helpers";

interface ExpenseCardProps {
  expense: ITransactionData;
  onEdit: (expense: ITransactionData) => void;
  onDelete: (id: string) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all bg-white shadow-xs group">
      <div className="flex items-center gap-3.5 min-w-0">
        <span className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0 group-hover:bg-white group-hover:shadow-xs transition-all">
          {expense.emoji || "💸"}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm truncate">
            {expense.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
              {expense.category}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(expense.date)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-sm font-bold text-rose-600">
            -{formatCurrency(expense.amount)}
          </div>
        </div>

        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Edit"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense._id || "")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ExpenseCard);


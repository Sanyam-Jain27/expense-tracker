"use client";

import React, { memo } from "react";
import { TrendingUp, TrendingDown, SquarePen, Trash2 } from "lucide-react";
import { ITransactionData } from "@/utils/types";
import { formatCurrency, formatDate } from "@/utils/helpers";

interface TransactionRowProps {
  item: ITransactionData;
  onEdit: (item: ITransactionData) => void;
  onDelete: (id: string, type?: string) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const isIncome = item.transactionType === "income";

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0 group-hover:bg-white group-hover:shadow-xs transition-all">
            {item.emoji || (isIncome ? "💰" : "💸")}
          </span>
          <span className="font-semibold text-slate-900 truncate max-w-[200px]">
            {item.title}
          </span>
        </div>
      </td>

      <td className="py-3.5 px-3">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isIncome
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {isIncome ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isIncome ? "Income" : "Expense"}
        </span>
      </td>

      <td className="py-3.5 px-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
          {item.category || "General"}
        </span>
      </td>

      <td className="py-3.5 px-3 text-xs text-slate-500 whitespace-nowrap font-medium">
        {formatDate(item.date)}
      </td>

      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <span
          className={`font-bold text-sm ${
            isIncome ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(item.amount)}
        </span>
      </td>

      <td className="py-3.5 px-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="Edit"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item._id || "", item.transactionType)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default memo(TransactionRow);


"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ITransactionData } from "@/utils/types";
import { formatCurrency, formatDate } from "@/utils/helpers";

interface RecentTransactionsProps {
  transactions: ITransactionData[];
  totalCount: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  totalCount,
}) => {
  return (
    <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent Transactions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest recorded financial activities
          </p>
        </div>
        <Link
          href="/transaction"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          View All ({totalCount})
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-3">Item</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactions.map((item) => {
                const isIncome = item.transactionType === "income";
                return (
                  <tr
                    key={item._id || `${item.title}-${item.date}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                          {item.emoji || (isIncome ? "💰" : "💸")}
                        </span>
                        <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                        {item.category || "General"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-sm ${
                          isIncome ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {isIncome ? "+" : "-"}
                        {formatCurrency(item.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-44 flex flex-col items-center justify-center text-slate-400 gap-3">
          <span className="text-sm font-medium">No transactions found</span>
          <Link
            href="/transaction"
            className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Add Your First Transaction
          </Link>
        </div>
      )}
    </div>
  );
};

export default memo(RecentTransactions);


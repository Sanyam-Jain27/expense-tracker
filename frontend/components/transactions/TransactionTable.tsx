"use client";

import React, { memo } from "react";
import { ITransactionData } from "@/utils/types";
import TransactionRow from "./TransactionRow";
import EmptyState from "@/components/shared/EmptyState";

interface TransactionTableProps {
  transactions: ITransactionData[];
  onEdit: (item: ITransactionData) => void;
  onDelete: (id: string, type?: string) => void;
  onAddNew: () => void;
  hasFilters: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  onAddNew,
  hasFilters,
}) => {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? "No matching transactions found" : "No transactions recorded yet"}
        description={
          hasFilters
            ? "Try adjusting your search query or switching filters to find what you're looking for."
            : "Record your first income or expense to see detailed breakdowns and cashflow metrics."
        }
        actionText="Record First Transaction"
        onAction={onAddNew}
        className="h-56"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="py-3.5 px-4">Transaction</th>
            <th className="py-3.5 px-3">Type</th>
            <th className="py-3.5 px-3">Category</th>
            <th className="py-3.5 px-3">Date</th>
            <th className="py-3.5 px-4 text-right">Amount</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {transactions.map((item) => (
            <TransactionRow
              key={item._id || `${item.title}-${item.date}`}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(TransactionTable);


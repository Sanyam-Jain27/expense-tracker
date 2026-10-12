"use client";

import React, { memo } from "react";
import { ITransactionData } from "@/utils/types";
import ExpenseCard from "./ExpenseCard";
import EmptyState from "@/components/shared/EmptyState";

interface ExpenseGridProps {
  expenses: ITransactionData[];
  onEdit: (expense: ITransactionData) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  hasFilters: boolean;
}

const ExpenseGrid: React.FC<ExpenseGridProps> = ({
  expenses,
  onEdit,
  onDelete,
  onAddNew,
  hasFilters,
}) => {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? "No matching expenses found" : "No expenses recorded yet"}
        description={
          hasFilters
            ? "Try clearing your search term or selecting 'All Categories'."
            : "Add your first expense to begin tracking where your money goes."
        }
        actionText="Add New Expense"
        onAction={onAddNew}
        className="h-44"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense._id || `${expense.title}-${expense.date}`}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default memo(ExpenseGrid);


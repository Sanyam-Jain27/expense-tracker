"use client";

import React, { memo } from "react";
import { ITransactionData } from "@/utils/types";
import IncomeCard from "./IncomeCard";
import EmptyState from "@/components/shared/EmptyState";

interface IncomeGridProps {
  incomes: ITransactionData[];
  onEdit: (income: ITransactionData) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  hasFilters: boolean;
}

const IncomeGrid: React.FC<IncomeGridProps> = ({
  incomes,
  onEdit,
  onDelete,
  onAddNew,
  hasFilters,
}) => {
  if (incomes.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? "No matching income records found" : "No income records yet"}
        description={
          hasFilters
            ? "Try clearing your search term or selecting 'All Sources'."
            : "Record your earnings, salary, or investment returns to view cash inflows."
        }
        actionText="Add New Income"
        onAction={onAddNew}
        className="h-44"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {incomes.map((income) => (
        <IncomeCard
          key={income._id || `${income.title}-${income.date}`}
          income={income}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default memo(IncomeGrid);


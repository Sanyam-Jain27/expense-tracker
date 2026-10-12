"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import Highcharts from "highcharts";

import ExpenseModel from "./ExpenseModel";
import { Spinner } from "./ui/spinner";
import DynamicChart from "./shared/DynamicChart";
import {
  addExpense,
  deleteExpense,
  fetchExpense,
  updateExpense,
} from "@/services/expense.services";
import { IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { fetchTransactionsList, getChartOptions } from "@/utils/helpers";

import ExpenseMetrics from "./expense/ExpenseMetrics";
import ExpenseFilters from "./expense/ExpenseFilters";
import ExpenseGrid from "./expense/ExpenseGrid";

const Expense = () => {
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState<ITransactionData[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expenseObj, setExpenseObj] = useState<ITransactionData | null>(null);
  const [seriesData, setSeriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { getToken } = useAuth();

  const handleFetchUserExpense = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      const list = await fetchExpense(token);
      setExpenseList(list || []);
      const { newSeriesData = [], newCategories = [] } =
        fetchTransactionsList(list || []);
      setSeriesData(newSeriesData);
      setCategories(newCategories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (data: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) return;
      await addExpense(data, token);
      await handleFetchUserExpense();
      toast.success("Expense added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while adding expense");
    }
  };

  const handleUpdateExpense = async (expense: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token || !expense._id) return;
      await updateExpense(expense, expense._id, token);
      await handleFetchUserExpense();
      setIsEditMode(false);
      toast.success("Expense updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error updating expense");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await deleteExpense(id, token);
      await handleFetchUserExpense();
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while deleting");
    }
  };

  useEffect(() => {
    handleFetchUserExpense();
  }, []);

  const totalSpent = useMemo(
    () => expenseList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [expenseList]
  );
  const avgExpense = expenseList.length > 0 ? totalSpent / expenseList.length : 0;

  const filteredExpenses = useMemo(() => {
    return expenseList.filter((item) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        (item.title && item.title.toLowerCase().includes(searchLower)) ||
        (item.category && item.category.toLowerCase().includes(searchLower));
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenseList, searchTerm, selectedCategory]);

  const options: Highcharts.Options = useMemo(() => {
    return getChartOptions(categories, seriesData);
  }, [categories, seriesData]);

  const handleEditClick = (expense: ITransactionData) => {
    setExpenseObj(expense);
    setIsEditMode(true);
    setShowExpenseModal(true);
  };

  const handleAddNewClick = () => {
    setExpenseObj(null);
    setIsEditMode(false);
    setShowExpenseModal(true);
  };

  return (
    <div className="w-full px-6 py-8 md:px-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Expenses
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Monitor and optimize your outgoing cash flows
          </p>
        </div>

        <ExpenseModel
          onAddExpense={handleAddExpense}
          onUpdateExpense={handleUpdateExpense}
          showExpenseModal={showExpenseModal}
          setshowExpenseModal={setShowExpenseModal}
          expenseObj={expenseObj}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </div>

      {/* Summary KPI Metrics */}
      <ExpenseMetrics
        totalSpent={totalSpent}
        itemCount={expenseList.length}
        avgExpense={avgExpense}
      />

      {/* Chart Overview */}
      {expenseList.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            Expense Timeline & Trends
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Track day-by-day spending patterns
          </p>
          <DynamicChart options={options} />
        </div>
      )}

      {/* Filterable Grid Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <ExpenseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-56 gap-2">
            <Spinner className="w-8 h-8 text-rose-600" />
            <span className="text-xs text-slate-400 font-medium">Loading expenses...</span>
          </div>
        ) : (
          <ExpenseGrid
            expenses={filteredExpenses}
            onEdit={handleEditClick}
            onDelete={handleDeleteExpense}
            onAddNew={handleAddNewClick}
            hasFilters={Boolean(searchTerm || selectedCategory !== "all")}
          />
        )}
      </div>
    </div>
  );
};

export default Expense;

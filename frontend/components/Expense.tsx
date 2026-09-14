"use client";

import { toast } from "sonner";
import ExpenseModel from "./ExpenseModel";
import {
  TrendingDown,
  SquarePen,
  Trash2,
  Search,
  Filter,
  ArrowDownRight,
  Tag,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  addExpense,
  deleteExpense,
  fetchExpense,
  updateExpense,
} from "@/services/expense.services";
import { IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "./ui/spinner";
import {
  fetchTransactionsList,
  getChartOptions,
  formatCurrency,
  formatDate,
} from "@/utils/helpers";
import { EXPENSE_CATEGORY_CONSTANTS } from "@/utils/constants";

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
      const { newSeriesData = [], newCategories = [] } = fetchTransactionsList(
        list || []
      );
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
    () =>
      expenseList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [expenseList]
  );
  const avgExpense =
    expenseList.length > 0 ? totalSpent / expenseList.length : 0;

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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Expenses
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">
            -{formatCurrency(totalSpent)}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Transactions
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {expenseList.length} items
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average Expense
            </span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {formatCurrency(avgExpense)}
          </div>
        </div>
      </div>

      {/* Chart Overview */}
      {expenseList.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            Expense Timeline & Trends
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Track day-by-day spending patterns
          </p>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORY_CONSTANTS.map((cat) => (
                <option key={cat.value} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expense Grid / List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-56 gap-2">
            <Spinner className="w-8 h-8 text-rose-600" />
            <span className="text-xs text-slate-400 font-medium">
              Loading expenses...
            </span>
          </div>
        ) : filteredExpenses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense._id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all bg-white shadow-xs group"
              >
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
                      onClick={() => {
                        setExpenseObj(expense);
                        setIsEditMode(true);
                        setShowExpenseModal(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <SquarePen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense._id || "")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-slate-400 gap-3 border border-dashed border-slate-200 rounded-xl">
            <span className="text-sm font-medium">No expenses found</span>
            <button
              onClick={() => {
                setExpenseObj(null);
                setIsEditMode(false);
                setShowExpenseModal(true);
              }}
              className="text-xs font-semibold px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Add New Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expense;

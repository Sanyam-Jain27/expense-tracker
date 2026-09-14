"use client";

import { toast } from "sonner";
import IncomeModel from "./IncomeModel";
import {
  TrendingUp,
  SquarePen,
  Trash2,
  Search,
  Filter,
  ArrowUpRight,
  Tag,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  addIncome,
  deleteIncome,
  fetchIncome,
  updateIncome,
} from "@/services/income.services";
import { IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "./ui/spinner";
import {
  fetchTransactionsList,
  getChartOptions,
  formatCurrency,
  formatDate,
} from "@/utils/helpers";
import { INCOME_CATEGORY_CONSTANTS } from "@/utils/constants";

const Income = () => {
  const [loading, setLoading] = useState(false);
  const [incomeList, setIncomeList] = useState<ITransactionData[]>([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [incomeObj, setIncomeObj] = useState<ITransactionData | null>(null);
  const [seriesData, setSeriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { getToken } = useAuth();

  const handleFetchUserIncome = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      const list = await fetchIncome(token);
      setIncomeList(list || []);
      const { newSeriesData = [], newCategories = [] } = fetchTransactionsList(
        list || []
      );
      setSeriesData(newSeriesData);
      setCategories(newCategories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load income records");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (data: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) return;
      await addIncome(data, token);
      await handleFetchUserIncome();
      toast.success("Income added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while adding income");
    }
  };

  const handleUpdateIncome = async (income: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token || !income._id) return;
      await updateIncome(income, income._id, token);
      await handleFetchUserIncome();
      setIsEditMode(false);
      toast.success("Income updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error updating income");
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await deleteIncome(id, token);
      await handleFetchUserIncome();
      toast.success("Income deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while deleting");
    }
  };

  useEffect(() => {
    handleFetchUserIncome();
  }, []);

  const totalEarned = useMemo(
    () => incomeList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [incomeList]
  );
  const avgIncome = incomeList.length > 0 ? totalEarned / incomeList.length : 0;

  const filteredIncomes = useMemo(() => {
    return incomeList.filter((item) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        (item.title && item.title.toLowerCase().includes(searchLower)) ||
        (item.category && item.category.toLowerCase().includes(searchLower));
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [incomeList, searchTerm, selectedCategory]);

  const options: Highcharts.Options = useMemo(() => {
    return getChartOptions(categories, seriesData);
  }, [categories, seriesData]);

  return (
    <div className="w-full px-6 py-8 md:px-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Income Streams
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Track and analyze your income sources and earnings
          </p>
        </div>

        <IncomeModel
          onAddIncome={handleAddIncome}
          onUpdateIncome={handleUpdateIncome}
          showIncomeModal={showIncomeModal}
          setshowIncomeModal={setShowIncomeModal}
          incomeObj={incomeObj}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Inflow
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            +{formatCurrency(totalEarned)}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Income Records
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {incomeList.length} items
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average Stream
            </span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {formatCurrency(avgIncome)}
          </div>
        </div>
      </div>

      {/* Chart Overview */}
      {incomeList.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            Income Timeline & Inflow
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Visualize income patterns over time
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
              placeholder="Search income sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Sources</option>
              {INCOME_CATEGORY_CONSTANTS.map((cat) => (
                <option key={cat.value} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Income Grid / List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-56 gap-2">
            <Spinner className="w-8 h-8 text-emerald-600" />
            <span className="text-xs text-slate-400 font-medium">
              Loading income records...
            </span>
          </div>
        ) : filteredIncomes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIncomes.map((income) => (
              <div
                key={income._id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all bg-white shadow-xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0 group-hover:bg-white group-hover:shadow-xs transition-all">
                    {income.emoji || "💰"}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">
                      {income.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                        {income.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(income.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-600">
                      +{formatCurrency(income.amount)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                    <button
                      onClick={() => {
                        setIncomeObj(income);
                        setIsEditMode(true);
                        setShowIncomeModal(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <SquarePen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteIncome(income._id || "")}
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
            <span className="text-sm font-medium">No income records found</span>
            <button
              onClick={() => {
                setIncomeObj(null);
                setIsEditMode(false);
                setShowIncomeModal(true);
              }}
              className="text-xs font-semibold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Add New Income
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Income;

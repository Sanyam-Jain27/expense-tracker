"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import Highcharts from "highcharts";

import IncomeModel from "./IncomeModel";
import { Spinner } from "./ui/spinner";
import DynamicChart from "./shared/DynamicChart";
import {
  addIncome,
  deleteIncome,
  fetchIncome,
  updateIncome,
} from "@/services/income.services";
import { IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { fetchTransactionsList, getChartOptions } from "@/utils/helpers";

import IncomeMetrics from "./income/IncomeMetrics";
import IncomeFilters from "./income/IncomeFilters";
import IncomeGrid from "./income/IncomeGrid";

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
      const { newSeriesData = [], newCategories = [] } =
        fetchTransactionsList(list || []);
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

  const handleEditClick = (income: ITransactionData) => {
    setIncomeObj(income);
    setIsEditMode(true);
    setShowIncomeModal(true);
  };

  const handleAddNewClick = () => {
    setIncomeObj(null);
    setIsEditMode(false);
    setShowIncomeModal(true);
  };

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

      {/* Summary KPI Metrics */}
      <IncomeMetrics
        totalEarned={totalEarned}
        itemCount={incomeList.length}
        avgIncome={avgIncome}
      />

      {/* Chart Overview */}
      {incomeList.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            Income Timeline & Inflow
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Visualize income patterns over time
          </p>
          <DynamicChart options={options} />
        </div>
      )}

      {/* Filterable Grid Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <IncomeFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-56 gap-2">
            <Spinner className="w-8 h-8 text-emerald-600" />
            <span className="text-xs text-slate-400 font-medium">Loading income records...</span>
          </div>
        ) : (
          <IncomeGrid
            incomes={filteredIncomes}
            onEdit={handleEditClick}
            onDelete={handleDeleteIncome}
            onAddNew={handleAddNewClick}
            hasFilters={Boolean(searchTerm || selectedCategory !== "all")}
          />
        )}
      </div>
    </div>
  );
};

export default Income;

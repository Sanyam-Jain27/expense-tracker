import Highcharts from "highcharts";
import {
  ITransactionData,
  ChartTypes,
  IChartSeriesPoint,
  IPieData,
} from "./types";

export const formatCurrency = (amount: number | string | undefined): string => {
  const num = Number(amount);
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (
  dateValue: string | Date | null | undefined
): string => {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const fetchTransactionsList = (list: ITransactionData[]) => {
  const chartData = list
    .filter((t) => t.date && !isNaN(new Date(t.date).getTime()))
    .map((t: ITransactionData) => {
      return {
        x: new Date(t.date || ""),
        y: Number(t.amount) || 0,
        type: t.transactionType,
        icon: t.emoji || "💵",
        category: t.category || "General",
      };
    });

  const sortedChartDataByDate = chartData.sort(
    (a, b) => a.x.getTime() - b.x.getTime()
  );

  const newSeriesData: IChartSeriesPoint[] = sortedChartDataByDate.map(
    (point, index: number) => {
      const { y, type, icon, category, x } = point;
      return {
        x: index,
        y,
        type,
        icon,
        tCategory: category,
        rawDate: x,
      };
    }
  );

  const newCategories = sortedChartDataByDate.map((p) =>
    p.x.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  );

  return {
    newSeriesData,
    newCategories,
  };
};

const getChartOptions = (
  categories: string[],
  seriesData: IChartSeriesPoint[],
  chartType: ChartTypes = "column"
): Highcharts.Options => {
  return {
    chart: {
      type: chartType,
      backgroundColor: "transparent",
      height: 280,
      spacing: [10, 10, 15, 10],
    },
    title: { text: "" },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories,
      labels: {
        style: { color: "#64748b", fontSize: "12px", fontWeight: "500" },
      },
      lineColor: "#e2e8f0",
      tickColor: "#e2e8f0",
    },
    yAxis: {
      title: { text: "" },
      labels: {
        style: { color: "#64748b", fontSize: "12px", fontWeight: "500" },
        formatter: function () {
          return `$${this.value}`;
        },
      },
      gridLineColor: "#f1f5f9",
      gridLineDashStyle: "Dash",
    },
    tooltip: {
      shape: "rect",
      useHTML: true,
      shadow: false,
      backgroundColor: "transparent",
      borderWidth: 0,
      padding: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: function (this: any) {
        const point = this.point;
        const { type, icon, tCategory } = point;
        const dateLabel = categories[this.x] || "";
        const isIncome = type === "income";

        return `<div style="background:#0f172a; color:#fff; padding:10px 14px; border-radius:12px; font-family:system-ui; box-shadow:0 10px 25px -5px rgba(0,0,0,0.2); min-width:140px;">
          <div style="font-size:11px; color:#94a3b8; margin-bottom:4px; font-weight:500;">${dateLabel}</div>
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span>${icon || "💵"}</span>
            <span style="font-weight:600; font-size:13px;">${tCategory || "General"}</span>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:700; color:${isIncome ? "#34d399" : "#fb7185"};">
            <span>${isIncome ? "+ Income" : "- Expense"}</span>
            <span>$${Number(this.y).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>`;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 8,
        borderWidth: 0,
        color: "#6366f1",
      },
      line: {
        color: "#6366f1",
        lineWidth: 3,
        marker: {
          radius: 4,
          fillColor: "#ffffff",
          lineWidth: 2,
          lineColor: "#6366f1",
        },
      },
    },
    series: [
      {
        type: chartType,
        data: seriesData,
        color: "#6366f1",
      },
    ],
  };
};

const getMonthlyIncomeExpense = async (
  incomeList: ITransactionData[],
  expenseList: ITransactionData[]
) => {
  interface IMonthSummary {
    label: string;
    income: number;
    expense: number;
  }

  const monthMap: Record<string, IMonthSummary> = {};

  const processItem = (item: ITransactionData, type: "income" | "expense") => {
    if (!item.date) return;
    const d = new Date(item.date);
    if (isNaN(d.getTime())) return;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;
    const label = d.toLocaleString("default", { month: "short", year: "numeric" });

    if (!monthMap[key]) {
      monthMap[key] = { label, income: 0, expense: 0 };
    }

    if (type === "income") {
      monthMap[key].income += Number(item.amount) || 0;
    } else {
      monthMap[key].expense += Number(item.amount) || 0;
    }
  };

  incomeList.forEach((t) => processItem(t, "income"));
  expenseList.forEach((t) => processItem(t, "expense"));

  // Sort chronologically by YYYY-MM key
  const sortedKeys = Object.keys(monthMap).sort();
  const categories = sortedKeys.map((k) => monthMap[k].label);
  const incomeSeries = sortedKeys.map((k) => monthMap[k].income);
  const expenseSeries = sortedKeys.map((k) => monthMap[k].expense);

  return { incomeSeries, expenseSeries, categories };
};

const getMoneyFlowOptions = (
  categories: string[],
  incomeSeries: number[],
  expenseSeries: number[]
): Highcharts.Options => {
  return {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      height: 320,
      marginTop: 50,
      spacing: [10, 10, 15, 10],
    },
    title: { text: "" },
    legend: {
      align: "right",
      verticalAlign: "top",
      layout: "horizontal",
      symbolRadius: 6,
      symbolHeight: 8,
      symbolWidth: 8,
      itemStyle: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#475569",
      },
      y: -10,
    },
    xAxis: {
      categories,
      labels: {
        style: { fontSize: "12px", fontWeight: "500", color: "#64748b" },
      },
      lineColor: "#e2e8f0",
      tickColor: "#e2e8f0",
    },
    yAxis: {
      title: { text: "" },
      labels: {
        style: { fontSize: "12px", fontWeight: "500", color: "#64748b" },
        formatter: function () {
          return `$${Number(this.value).toLocaleString()}`;
        },
      },
      gridLineColor: "#f1f5f9",
      gridLineDashStyle: "Dash",
    },
    tooltip: {
      shape: "rect",
      useHTML: true,
      shadow: false,
      backgroundColor: "transparent",
      borderWidth: 0,
      padding: 0,
      formatter: function () {
        const isIncome = this.series.name === "Income";
        return `<div style="background:#0f172a; color:#fff; padding:8px 12px; border-radius:10px; font-family:system-ui; box-shadow:0 10px 25px -5px rgba(0,0,0,0.2);">
          <div style="font-size:11px; color:#94a3b8; margin-bottom:2px;">${this.key} • ${this.series.name}</div>
          <div style="font-size:14px; font-weight:700; color:${isIncome ? "#34d399" : "#fb7185"};">
            $${Number(this.y).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>`;
      },
    },
    plotOptions: {
      column: {
        grouping: true,
        borderWidth: 0,
        borderRadius: 8,
        pointPadding: 0.1,
        groupPadding: 0.2,
      },
    },
    credits: { enabled: false },
    series: [
      {
        name: "Income",
        type: "column",
        data: incomeSeries,
        color: "#10b981", // modern emerald
      },
      {
        name: "Expense",
        type: "column",
        data: expenseSeries,
        color: "#f43f5e", // modern rose
      },
    ],
  };
};

const MODERN_PIE_PALETTE = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#14b8a6", // teal
  "#f97316", // orange
];

const getPieChartOptions = (categorySeries: IPieData[]): Highcharts.Options => {
  let totalValue = 0;
  categorySeries.forEach((ct) => {
    totalValue += ct.y;
  });

  return {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 320,
    },
    colors: MODERN_PIE_PALETTE,
    credits: { enabled: false },
    title: {
      useHTML: true,
      text: `<div style="text-align: center; pointer-events: none;">
        <div style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Total</div>
        <div style="font-size: 17px; color: #0f172a; font-weight: 700; margin-top: 2px;">$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
      </div>`,
      align: "center",
      verticalAlign: "middle",
      y: -30,
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        fontSize: "12px",
        fontWeight: "500",
        color: "#475569",
      },
    },
    tooltip: {
      useHTML: true,
      shadow: false,
      borderWidth: 0,
      backgroundColor: "none",
      padding: 0,
      formatter: function () {
        const percent = totalValue > 0 ? (((this.y || 0) / totalValue) * 100).toFixed(1) : "0";
        return `<div style="background:#0f172a; color:#fff; padding:8px 12px; border-radius:10px; font-family:system-ui; box-shadow:0 10px 25px -5px rgba(0,0,0,0.2);">
          <div style="font-size:12px; font-weight:600;">${this.key || this.name}</div>
          <div style="font-size:13px; font-weight:700; color:#818cf8; margin-top:2px;">
            $${Number(this.y).toLocaleString()} <span style="font-size:11px; color:#94a3b8; font-weight:500;">(${percent}%)</span>
          </div>
        </div>`;
      },
    },
    plotOptions: {
      pie: {
        innerSize: "72%",
        size: "70%",
        center: ["50%", "45%"],
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 6,
        dataLabels: { enabled: false },
        showInLegend: true,
      },
    },
    series: [
      {
        type: "pie",
        data: categorySeries,
      },
    ],
  };
};

const getCategoryWiseValue = (transactions: ITransactionData[]) => {
  const categoryMap: Record<string, number> = {};

  transactions.forEach((tr) => {
    const cat = tr.category || "Other";
    if (!categoryMap[cat]) {
      categoryMap[cat] = 0;
    }
    categoryMap[cat] += Number(tr.amount) || 0;
  });

  return Object.entries(categoryMap)
    .map(([name, y]) => ({ name, y }))
    .sort((a, b) => b.y - a.y);
};

export {
  getChartOptions,
  fetchTransactionsList,
  getMonthlyIncomeExpense,
  getMoneyFlowOptions,
  getPieChartOptions,
  getCategoryWiseValue,
};

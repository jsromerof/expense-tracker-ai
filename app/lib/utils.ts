import { Expense, Category, FilterState } from "../types/expense";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function filterExpenses(expenses: Expense[], filters: FilterState): Expense[] {
  return expenses.filter((expense) => {
    if (filters.category !== "All" && expense.category !== filters.category) {
      return false;
    }
    if (
      filters.search &&
      !expense.description.toLowerCase().includes(filters.search.toLowerCase()) &&
      !expense.category.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.dateFrom && expense.date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && expense.date > filters.dateTo) {
      return false;
    }
    return true;
  });
}

export function getTotalByCategory(expenses: Expense[]): Record<Category, number> {
  const totals = {} as Record<Category, number>;
  for (const expense of expenses) {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
  }
  return totals;
}

export function getMonthlyTotals(expenses: Expense[]): { month: string; total: number }[] {
  const map: Record<string, number> = {};
  for (const expense of expenses) {
    const key = expense.date.slice(0, 7); // YYYY-MM
    map[key] = (map[key] || 0) + expense.amount;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month: format(parseISO(`${month}-01`), "MMM yyyy"),
      total,
    }));
}

export function getCurrentMonthExpenses(expenses: Expense[]): Expense[] {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return expenses.filter((e) => {
    try {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start, end });
    } catch {
      return false;
    }
  });
}

export function exportToCSV(expenses: Expense[]): void {
  const headers = ["Date", "Amount", "Category", "Description"];
  const rows = expenses.map((e) => [
    e.date,
    e.amount.toFixed(2),
    e.category,
    `"${e.description.replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `expenses-${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

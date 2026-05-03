"use client";

import { TrendingUp, Calendar, Award, Receipt } from "lucide-react";
import { Expense, CATEGORY_COLORS } from "../types/expense";
import {
  formatCurrency,
  getTotalByCategory,
  getCurrentMonthExpenses,
} from "../lib/utils";

interface Props {
  expenses: Expense[];
}

export default function SummaryCards({ expenses }: Props) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const monthlyExpenses = getCurrentMonthExpenses(expenses);
  const monthlyTotal = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = getTotalByCategory(expenses);

  const topCategory = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0];

  const cards = [
    {
      label: "Total Spent",
      value: formatCurrency(total),
      sub: `${expenses.length} expense${expenses.length !== 1 ? "s" : ""}`,
      icon: Receipt,
      color: "indigo",
    },
    {
      label: "This Month",
      value: formatCurrency(monthlyTotal),
      sub: `${monthlyExpenses.length} expense${monthlyExpenses.length !== 1 ? "s" : ""}`,
      icon: Calendar,
      color: "emerald",
    },
    {
      label: "Top Category",
      value: topCategory ? topCategory[0] : "—",
      sub: topCategory ? formatCurrency(topCategory[1]) : "No data yet",
      icon: Award,
      color: "amber",
    },
    {
      label: "Avg per Expense",
      value: expenses.length ? formatCurrency(total / expenses.length) : "$0.00",
      sub: "all time",
      icon: TrendingUp,
      color: "rose",
    },
  ] as const;

  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {card.label}
              </p>
              <div className={`p-1.5 rounded-lg ${colorMap[card.color]}`}>
                <Icon size={14} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-tight">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

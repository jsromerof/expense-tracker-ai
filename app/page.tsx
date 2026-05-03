"use client";

import { useState, useMemo } from "react";
import { PlusCircle, Download, Trash2, BarChart2, List } from "lucide-react";
import { useExpenses } from "./hooks/useExpenses";
import { filterExpenses, exportToCSV } from "./lib/utils";
import { Expense, ExpenseFormData, FilterState } from "./types/expense";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseCard from "./components/ExpenseCard";
import FilterBar from "./components/FilterBar";
import SummaryCards from "./components/SummaryCards";
import Charts from "./components/Charts";
import Toast, { ToastData } from "./components/Toast";
import EmptyState from "./components/EmptyState";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  category: "All",
  dateFrom: "",
  dateTo: "",
};

let toastCounter = 0;

export default function Home() {
  const { expenses, isLoaded, addExpense, updateExpense, deleteExpense, clearAll } =
    useExpenses();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [tab, setTab] = useState<"list" | "charts">("list");
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = useMemo(
    () => filterExpenses(expenses, filters),
    [expenses, filters]
  );

  function toast(message: string, type: "success" | "error" = "success") {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function handleSubmit(data: ExpenseFormData) {
    if (editTarget) {
      updateExpense(editTarget.id, data);
      toast("Expense updated.");
    } else {
      addExpense(data);
      toast("Expense added.");
    }
    setShowForm(false);
    setEditTarget(null);
  }

  function handleEdit(expense: Expense) {
    setEditTarget(expense);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    deleteExpense(id);
    toast("Expense deleted.");
  }

  function handleExport() {
    if (expenses.length === 0) {
      toast("Nothing to export.", "error");
      return;
    }
    exportToCSV(expenses);
    toast(`Exported ${expenses.length} expense${expenses.length !== 1 ? "s" : ""}.`);
  }

  function handleClearAll() {
    if (showClearConfirm) {
      clearAll();
      setShowClearConfirm(false);
      toast("All expenses cleared.");
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Expense Tracker
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {expenses.length} expense{expenses.length !== 1 ? "s" : ""} tracked
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={15} />
              Export CSV
            </button>
            {expenses.length > 0 && (
              <button
                onClick={handleClearAll}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors ${
                  showClearConfirm
                    ? "text-white bg-red-500 border-red-500 hover:bg-red-600"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Trash2 size={15} />
                {showClearConfirm ? "Confirm Clear" : "Clear All"}
              </button>
            )}
            <button
              onClick={() => {
                setEditTarget(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle size={15} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Summary cards */}
        <SummaryCards expenses={expenses} />

        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit">
          {(
            [
              { id: "list", icon: List, label: "Expenses" },
              { id: "charts", icon: BarChart2, label: "Charts" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {tab === "charts" ? (
          <Charts expenses={expenses} />
        ) : (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <FilterBar filters={filters} onChange={setFilters} />
            </div>

            {/* Results count */}
            {expenses.length > 0 && (
              <p className="text-xs text-gray-400 px-1">
                Showing {filtered.length} of {expenses.length} expense
                {expenses.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Expense list */}
            {expenses.length === 0 ? (
              <EmptyState
                onAdd={() => {
                  setEditTarget(null);
                  setShowForm(true);
                }}
              />
            ) : filtered.length === 0 ? (
              <EmptyState onAdd={() => {}} filtered />
            ) : (
              <div className="space-y-2">
                {filtered.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile actions */}
        <div className="sm:hidden flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
          {expenses.length > 0 && (
            <button
              onClick={handleClearAll}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm border rounded-lg transition-colors ${
                showClearConfirm
                  ? "text-white bg-red-500 border-red-500"
                  : "text-gray-600 border-gray-200 bg-white"
              }`}
            >
              <Trash2 size={15} />
              {showClearConfirm ? "Confirm?" : "Clear All"}
            </button>
          )}
        </div>
      </main>

      {/* Modal form */}
      {showForm && (
        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
          initialData={editTarget ?? undefined}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

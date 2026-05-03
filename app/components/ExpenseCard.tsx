"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Expense, CATEGORY_COLORS, CATEGORY_ICONS } from "../types/expense";
import { formatCurrency, formatDate } from "../lib/utils";

interface Props {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseCard({ expense, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const color = CATEGORY_COLORS[expense.category];
  const icon = CATEGORY_ICONS[expense.category];

  function handleDelete() {
    if (confirmDelete) {
      onDelete(expense.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  }

  return (
    <div className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-150">
      {/* Category icon */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
        style={{ backgroundColor: `${color}18` }}
      >
        {icon}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{expense.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {expense.category}
          </span>
          <span className="text-xs text-gray-400">{formatDate(expense.date)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className="flex-shrink-0 text-right">
        <span className="font-bold text-gray-900 text-base">
          {formatCurrency(expense.amount)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(expense)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Edit"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={handleDelete}
          className={`p-1.5 rounded-lg transition-colors ${
            confirmDelete
              ? "text-white bg-red-500 hover:bg-red-600"
              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
          }`}
          title={confirmDelete ? "Click again to confirm" : "Delete"}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

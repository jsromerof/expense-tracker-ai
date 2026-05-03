"use client";

import { useState, useEffect } from "react";
import { X, DollarSign, Calendar, Tag, FileText } from "lucide-react";
import { Expense, ExpenseFormData, CATEGORIES, Category } from "../types/expense";

interface Props {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  initialData?: Expense;
}

const today = () => new Date().toISOString().split("T")[0];

const emptyForm: ExpenseFormData = {
  date: today(),
  amount: "",
  category: "Food",
  description: "",
};

interface Errors {
  date?: string;
  amount?: string;
  description?: string;
}

export default function ExpenseForm({ onSubmit, onCancel, initialData }: Props) {
  const [form, setForm] = useState<ExpenseFormData>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date,
        amount: initialData.amount.toString(),
        category: initialData.category,
        description: initialData.description,
      });
    } else {
      setForm({ ...emptyForm, date: today() });
    }
  }, [initialData]);

  function validate(): boolean {
    const e: Errors = {};
    if (!form.date) e.date = "Date is required.";
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = "Enter a valid positive amount.";
    if (amt > 1_000_000) e.amount = "Amount is too large.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (form.description.trim().length > 200) e.description = "Max 200 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 150)); // brief feedback delay
    onSubmit(form);
    setSubmitting(false);
  }

  function field(
    key: keyof ExpenseFormData,
    value: string,
    onChange: (v: string) => void
  ) {
    return (v: string) => {
      onChange(v);
      if (errors[key as keyof Errors]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    };
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Expense" : "Add Expense"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount
            </label>
            <div className="relative">
              <DollarSign
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1000000"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) =>
                  field("amount", form.amount, (v) => setForm((p) => ({ ...p, amount: v })))(
                    e.target.value
                  )
                }
                className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.amount ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                value={form.date}
                max={today()}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.date ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-xs text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <div className="relative">
              <Tag
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value as Category }))
                }
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <div className="relative">
              <FileText
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <textarea
                rows={3}
                placeholder="What did you spend on?"
                value={form.description}
                onChange={(e) =>
                  field(
                    "description",
                    form.description,
                    (v) => setForm((p) => ({ ...p, description: v }))
                  )(e.target.value)
                }
                className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors ${
                  errors.description ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
            </div>
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-gray-400 ml-auto">
                {form.description.length}/200
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Saving…" : initialData ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { PlusCircle } from "lucide-react";

interface Props {
  onAdd: () => void;
  filtered?: boolean;
}

export default function EmptyState({ onAdd, filtered }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{filtered ? "🔍" : "💸"}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {filtered ? "No matching expenses" : "No expenses yet"}
      </h3>
      <p className="text-sm text-gray-400 mb-6 max-w-xs">
        {filtered
          ? "Try adjusting your filters or search query."
          : "Start tracking your spending by adding your first expense."}
      </p>
      {!filtered && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={16} />
          Add First Expense
        </button>
      )}
    </div>
  );
}

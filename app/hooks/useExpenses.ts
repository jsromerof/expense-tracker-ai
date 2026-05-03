"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseFormData } from "../types/expense";

const STORAGE_KEY = "expense-tracker-data";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setExpenses(JSON.parse(raw));
      }
    } catch {
      setExpenses([]);
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((data: Expense[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage quota exceeded — silent fail
    }
  }, []);

  const addExpense = useCallback(
    (formData: ExpenseFormData): Expense => {
      const expense: Expense = {
        id: generateId(),
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => {
        const updated = [expense, ...prev];
        persist(updated);
        return updated;
      });
      return expense;
    },
    [persist]
  );

  const updateExpense = useCallback(
    (id: string, formData: ExpenseFormData) => {
      setExpenses((prev) => {
        const updated = prev.map((e) =>
          e.id === id
            ? {
                ...e,
                date: formData.date,
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description.trim(),
              }
            : e
        );
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => {
        const updated = prev.filter((e) => e.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const clearAll = useCallback(() => {
    setExpenses([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    expenses,
    isLoaded,
    addExpense,
    updateExpense,
    deleteExpense,
    clearAll,
  };
}

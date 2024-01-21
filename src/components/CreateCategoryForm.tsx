"use client";

import { useCreateCategory } from "@/hooks/useCreateCategory";
import { CategoryWithoutItems } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

type Props = { listId: number };

export default function CreateCategoryForm({ listId }: Props) {
  const queryClient = useQueryClient();
  const createCategoryMutation = useCreateCategory();
  const [error, setError] = useState("");
  const pending = createCategoryMutation.isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const categoryName = String(formData.get("categoryName"));
    if (!categoryName) {
      return;
    }
    createCategoryMutation.mutate(
      { listId, categoryName },
      {
        onSuccess: (newCategory: CategoryWithoutItems) => {
          queryClient.setQueryData(
            [listId, "categories"],
            (categories: CategoryWithoutItems[]) => {
              return [...categories, newCategory];
            },
          );
        },
        onError: (error) => {
          setError(error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-8">
      <div>
        <label htmlFor="categoryName">Category name</label>
        <input
          type="text"
          id="categoryName"
          name="categoryName"
          className="border border-slate-500"
        />
        {error && <div className="font-bold text-red-600">{error}</div>}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-fit border border-slate-800 px-8 py-4"
      >
        {pending ? "Creating category..." : "Create category"}
      </button>
    </form>
  );
}

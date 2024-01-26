"use client";

import { useCreateCategory } from "@/hooks/useCreateCategory";
import { CategoryWithoutItems } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { Dictionary, Language } from "@/lib/dictionaries";

type Props = {
  listId: number;
  lang: Language;
  dictionary: Dictionary["categories_page"];
};

export default function CreateCategoryForm({
  listId,
  lang,
  dictionary,
}: Props) {
  const queryClient = useQueryClient();
  const createCategoryMutation = useCreateCategory(lang);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const pending = createCategoryMutation.isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
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
          setCategoryName("");
        },
        onError: (error) => {
          setError(error.message);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-md bg-blue-50 px-6 py-4 shadow-sm"
    >
      <h2 className="text-lg font-medium">{dictionary.create_new_category}</h2>
      <fieldset disabled={pending} className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="categoryName" className="font-medium">
            {dictionary.category_name}:
          </label>
          <Input
            type="text"
            id="categoryName"
            name="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="flex-1"
          />
        </div>
        {error && (
          <div className="font-bold text-red-600">
            {dictionary.error}: {error}
          </div>
        )}
        <Button
          type="submit"
          className="mt-4 flex items-center justify-center gap-2"
        >
          {pending ? (
            <>
              <Loader2 className="animate-spin" />
              <span>{dictionary.creating_cateogry}...</span>
            </>
          ) : (
            dictionary.create_category
          )}
        </Button>
      </fieldset>
    </form>
  );
}

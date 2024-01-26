"use client";

import { createCategory } from "@/actions/createCategory";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useCreateCategory = (lang: Language) => {
  type MutationType = {
    listId: number;
    categoryName: string;
  };
  return useMutation({
    mutationFn: async ({ listId, categoryName }: MutationType) => {
      const result = await createCategory(lang, listId, categoryName);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.newCategory;
    },
  });
};

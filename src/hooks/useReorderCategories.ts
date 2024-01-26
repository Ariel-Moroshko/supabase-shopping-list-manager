"use client";

import { reorderCategories } from "@/actions/reorderCategories";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useReorderCategories = (lang: Language) => {
  type MutationType = {
    listId: number;
    categoriesIds: number[];
  };
  return useMutation({
    mutationFn: async ({ listId, categoriesIds }: MutationType) => {
      const result = await reorderCategories(lang, listId, categoriesIds);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

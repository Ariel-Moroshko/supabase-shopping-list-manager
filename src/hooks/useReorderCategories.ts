"use client";

import { reorderCategories } from "@/actions/reorderCategories";
import { useMutation } from "@tanstack/react-query";

export const useReorderCategories = () => {
  type MutationType = {
    listId: number;
    categoriesIds: number[];
  };
  return useMutation({
    mutationFn: async ({ listId, categoriesIds }: MutationType) => {
      const result = await reorderCategories(listId, categoriesIds);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

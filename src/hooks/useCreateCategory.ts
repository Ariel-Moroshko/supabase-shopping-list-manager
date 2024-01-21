"use client";

import { createCategory } from "@/actions/createCategory";
import { useMutation } from "@tanstack/react-query";

export const useCreateCategory = () => {
  type MutationType = {
    listId: number;
    categoryName: string;
  };
  return useMutation({
    mutationFn: async ({ listId, categoryName }: MutationType) => {
      const result = await createCategory(listId, categoryName);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.newCategory;
    },
  });
};

"use client";

import { createItem } from "@/actions/createItem";
import { useMutation } from "@tanstack/react-query";

export const useCreateItem = () => {
  type MutationType = {
    listId: number;
    categoryId: number;
    itemName: string;
  };
  return useMutation({
    mutationFn: async ({ listId, categoryId, itemName }: MutationType) => {
      const result = await createItem(listId, categoryId, itemName);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.newItem;
    },
  });
};

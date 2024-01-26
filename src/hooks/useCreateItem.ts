"use client";

import { createItem } from "@/actions/createItem";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useCreateItem = (lang: Language) => {
  type MutationType = {
    listId: number;
    categoryId: number;
    itemName: string;
  };
  return useMutation({
    mutationFn: async ({ listId, categoryId, itemName }: MutationType) => {
      const result = await createItem(lang, listId, categoryId, itemName);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.newItem;
    },
  });
};

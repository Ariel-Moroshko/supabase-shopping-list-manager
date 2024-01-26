import { deleteItem } from "@/actions/deleteItem";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useDeleteItem = (lang: Language) => {
  return useMutation({
    mutationFn: async (itemId: number) => {
      const result = await deleteItem(lang, itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

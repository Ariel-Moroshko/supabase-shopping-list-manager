import { addItemToShoppingList } from "@/actions/addItemToShoppingList";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useAddItemToShoppingList = (language: Language) => {
  return useMutation({
    mutationFn: async (itemId: number) => {
      const result = await addItemToShoppingList(language, itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

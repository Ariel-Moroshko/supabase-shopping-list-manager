import { addItemToShoppingList } from "@/actions/addItemToShoppingList";
import { useMutation } from "@tanstack/react-query";

export const useAddItemToShoppingList = () => {
  return useMutation({
    mutationFn: async (itemId: number) => {
      const result = await addItemToShoppingList(itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

import { deleteItem } from "@/actions/deleteItem";
import { useMutation } from "@tanstack/react-query";

export const useDeleteItem = () => {
  return useMutation({
    mutationFn: async (itemId: number) => {
      const result = await deleteItem(itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

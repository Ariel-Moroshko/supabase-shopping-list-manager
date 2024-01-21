import { clearPickedUpItems } from "@/actions/clearPickedUpItems";
import { useMutation } from "@tanstack/react-query";

export const useClearPickedUpItems = () => {
  return useMutation({
    mutationFn: async (listId: number) => {
      const result = await clearPickedUpItems(listId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

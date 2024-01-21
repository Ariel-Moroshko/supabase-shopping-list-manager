import { undoPickedUpItem } from "@/actions/undoPickedUpItem";
import { useMutation } from "@tanstack/react-query";

export const useUndoPickedUpItem = () => {
  return useMutation({
    mutationFn: async (itemId: number) => {
      const result = await undoPickedUpItem(itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

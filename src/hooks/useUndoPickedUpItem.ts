import { undoPickedUpItem } from "@/actions/undoPickedUpItem";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useUndoPickedUpItem = (lang: Language) => {
  return useMutation({
    mutationFn: async (itemId: number) => {
      const result = await undoPickedUpItem(lang, itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

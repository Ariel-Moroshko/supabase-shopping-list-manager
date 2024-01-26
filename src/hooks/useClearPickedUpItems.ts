import { clearPickedUpItems } from "@/actions/clearPickedUpItems";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useClearPickedUpItems = (lang: Language) => {
  return useMutation({
    mutationFn: async (listId: number) => {
      const result = await clearPickedUpItems(lang, listId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

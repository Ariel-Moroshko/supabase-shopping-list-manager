import { updateItemName } from "@/actions/updateItemName";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useEditItemName = (lang: Language) => {
  type MutationType = {
    itemId: number;
    itemName: string;
  };
  return useMutation({
    mutationFn: async ({ itemId, itemName }: MutationType) => {
      const result = await updateItemName(lang, itemId, itemName);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

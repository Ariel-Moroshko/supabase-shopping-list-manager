import { deleteItem } from "@/actions/deleteItem";
import { updateCategoryName } from "@/actions/updateCategoryName";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useEditCategoryName = (lang: Language) => {
  type MutationType = {
    categoryId: number;
    categoryName: string;
  };
  return useMutation({
    mutationFn: async ({ categoryId, categoryName }: MutationType) => {
      const result = await updateCategoryName(lang, categoryId, categoryName);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

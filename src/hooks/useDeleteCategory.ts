import { deleteCategory } from "@/actions/deleteCategory";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCategory = (lang: Language) => {
  return useMutation({
    mutationFn: async (categoryId: number) => {
      const result = await deleteCategory(lang, categoryId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

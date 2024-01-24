import { deleteItem } from "@/actions/deleteItem";
import { updateCategoryName } from "@/actions/updateCategoryName";
import { useMutation } from "@tanstack/react-query";

export const useEditCategoryName = () => {
  type MutationType = {
    categoryId: number;
    categoryName: string;
  };
  return useMutation({
    mutationFn: async ({ categoryId, categoryName }: MutationType) => {
      const result = await updateCategoryName(categoryId, categoryName);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

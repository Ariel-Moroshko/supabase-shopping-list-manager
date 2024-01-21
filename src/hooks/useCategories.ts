"use client";

import { getCategories } from "@/actions/getCategories";
import { CategoryWithoutItems } from "@/types/List";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (
  listId: number,
  initialCategories: CategoryWithoutItems[],
) => {
  return useQuery<CategoryWithoutItems[]>({
    queryKey: [listId, "categories"],
    queryFn: async () => getCategories(listId),
    initialData: initialCategories,
  });
};

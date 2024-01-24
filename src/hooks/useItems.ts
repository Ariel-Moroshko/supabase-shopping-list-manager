"use client";

import { getItems } from "@/actions/getItems";
import { List } from "@/types/List";
import { useQuery } from "@tanstack/react-query";

export const useItems = (initialList: List) => {
  return useQuery<List>({
    queryKey: [initialList.id, "items"],
    queryFn: async () => getItems(initialList.id),
    initialData: initialList,
  });
};

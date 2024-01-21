import { getList } from "@/actions/getList";
import { List } from "@/types/List";
import { useQuery } from "@tanstack/react-query";

export const useList = (initialList: List) => {
  return useQuery<List>({
    queryKey: ["list", initialList.id],
    queryFn: async () => getList(initialList.id),
    initialData: initialList,
  });
};

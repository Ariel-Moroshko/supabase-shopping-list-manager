"use client";

import { Item, List } from "@/types/List";
import { ReactNode, createContext, useCallback, useState } from "react";

type ListContext = {
  list: List;
  updateItem: (updatedItem: Item) => void;
};
export const listContext = createContext<ListContext | null>(null);

type Props = {
  children: ReactNode;
  initialList: List;
};
export default function ListContextProvider({ children, initialList }: Props) {
  const [list, setList] = useState<List>(initialList);

  const handleUpdateItem = useCallback((updateItem: Item) => {
    setList((prevList) => ({
      ...prevList,
      categories: prevList.categories.map((category) => {
        return {
          ...category,
          items:
            category.id === updateItem.categoryId
              ? category.items.map((item) =>
                  item.id === updateItem.id ? updateItem : item,
                )
              : category.items,
        };
      }),
    }));
  }, []);

  return (
    <listContext.Provider value={{ list, updateItem: handleUpdateItem }}>
      {children}
    </listContext.Provider>
  );
}

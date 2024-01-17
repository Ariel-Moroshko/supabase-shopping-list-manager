"use client";

import { Category, Item, List } from "@/types/List";
import AllItemsList from "./AllItemsList";
import { useListTabContext } from "@/hooks/useListTabContext";
import ShoppingList from "./ShoppingList";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";

type Props = { list: List };

export default function ListPage({ list }: Props) {
  const { tab } = useListTabContext();
  const [localList, setLocalList] = useState<List>(list);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const handleNewItem = (
      payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>,
    ) => {
      console.log(payload);
      if (payload.table === "items") {
        const newItem = payload.new as Item;
        setLocalList((prevList) => ({
          ...prevList,
          categories: prevList.categories.map((category) => {
            return {
              ...category,
              items:
                category.id === newItem.categoryId
                  ? category.items.map((item) =>
                      item.id === newItem.id ? newItem : item,
                    )
                  : category.items,
            };
          }),
        }));
      }
    };

    const channel = supabase
      .channel("list-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "items",
        },
        handleNewItem,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (tab === "allItems") {
    return <AllItemsList list={localList} />;
  } else {
    return <ShoppingList list={localList} />;
  }
}

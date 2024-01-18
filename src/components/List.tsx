"use client";

import { Category, Item, List } from "@/types/List";
import AllItemsList from "./AllItemsList";
import { useTabContext } from "@/hooks/useTabContext";
import ShoppingList from "./ShoppingList";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import {
  REALTIME_CHANNEL_STATES,
  RealtimeChannel,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import ListContextProvider from "./providers/ListContextProvider";
import { useListContext } from "@/hooks/useListContext";

export default function ListPage() {
  const { tab } = useTabContext();
  const { updateItem } = useListContext();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const handleNewItem = (
      payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>,
    ) => {
      console.log(payload);
      if (payload.table === "items") {
        const newItem = payload.new as Item;
        updateItem(newItem);
      }
    };

    const handleChannelStatusChange = async (
      status: "SUBSCRIBED" | "TIMED_OUT" | "CLOSED" | "CHANNEL_ERROR",
      error?: Error,
    ) => {
      console.log(
        "*".repeat(20),
        new Date().toLocaleString(),
        "status/error changed. status is:",
        status,
        "error is:",
        error?.name,
        ":",
        error?.message,
      );
      // if (channel?.state === REALTIME_CHANNEL_STATES.errored) {
      //   console.log(
      //     "----> REALTIME_CHANNEL_STATES.errored, removing channel and subscribing again",
      //   );
      //   await unSubscribe();
      //   channel = subscribe();
      // }
    };

    console.log("subscribing to channel updates");
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
      .subscribe(handleChannelStatusChange);

    // const unSubscribe = async () => {
    //   const removeChannel = await supabase.removeChannel(channel!);
    // };

    // channel = subscribe();

    return () => {
      console.log("removing ws");
      supabase.removeChannel(channel);
    };
  }, [updateItem]);
  return tab === "allItems" ? <AllItemsList /> : <ShoppingList />;
}

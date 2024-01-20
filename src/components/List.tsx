"use client";

import { List } from "@/types/List";
import AllItemsList from "./AllItemsList";
import { useTabContext } from "@/hooks/useTabContext";
import ShoppingList from "./ShoppingList";
import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import {
  REALTIME_CHANNEL_STATES,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import SignOut from "./SignOut";

type Props = { list: List };

export default function ListPage({ list }: Props) {
  const { tab } = useTabContext();
  const router = useRouter();
  const networkStatus = useNetworkStatus();

  useEffect(() => {
    let supabase = getSupabaseBrowserClient();
    const handleRealTimeEvent = (
      payload: RealtimePostgresChangesPayload<{
        [key: string]: any;
      }>,
    ) => {
      console.log(payload);
      router.refresh();
    };

    const subscribeToUpdates = () => {
      return supabase
        .channel("list-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "items",
          },
          handleRealTimeEvent,
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "categories",
          },
          handleRealTimeEvent,
        )
        .subscribe(
          async (
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
            if (channel.state === REALTIME_CHANNEL_STATES.errored) {
              console.log(
                "----> REALTIME_CHANNEL_STATES.errored, removing channel and subscribing again",
              );
            }
            if (status === "CLOSED" && !isReSubscribing) {
              console.log(
                "***** channel was CLOSED! removing it and resubscribing...",
              );
              isReSubscribing = true;
              await supabase.removeChannel(channel);
              const authResponse = await supabase.auth.refreshSession();
              supabase = getSupabaseBrowserClient();
              console.log("got authResponse=", authResponse);
              channel = subscribeToUpdates();
              isReSubscribing = false;
            }
          },
        );
    };

    console.log("subscribing to channel updates");
    let isReSubscribing = false;
    let channel = subscribeToUpdates();

    return () => {
      console.log("removing ws");
      isReSubscribing = true;
      supabase.removeChannel(channel);
    };
  }, [router]);
  return (
    <>
      <SignOut />
      {networkStatus === "offline" && (
        <div className="w-full rounded-md bg-red-500 py-3 text-center font-bold text-red-50 shadow-lg">
          No network connection
        </div>
      )}
      {tab === "allItems" ? (
        <AllItemsList list={list} />
      ) : (
        <ShoppingList list={list} />
      )}
    </>
  );
}

"use client";

import { List } from "@/types/List";
import AllItemsList from "./AllItemsList";
import { useTabContext } from "@/hooks/useTabContext";
import ShoppingList from "./ShoppingList";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import SignOut from "./SignOut";

type Props = { list: List };

export default function ListPage({ list }: Props) {
  const { tab } = useTabContext();
  const router = useRouter();
  const networkStatus = useNetworkStatus();

  useEffect(() => {
    let refreshIntervalId = window.setInterval(() => {
      router.refresh();
    }, 5000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        console.log("hidden, clearing interval");
        window.clearInterval(refreshIntervalId);
      } else {
        console.log("visible, refreshing and setting interval");
        router.refresh();
        refreshIntervalId = window.setInterval(() => {
          router.refresh();
        }, 5000);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(refreshIntervalId);
    };
  });

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

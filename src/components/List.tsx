"use client";

import { List } from "@/types/List";
import AllItemsList from "./AllItemsList";
import { useTabContext } from "@/hooks/useTabContext";
import ShoppingList from "./ShoppingList";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import SignOut from "./SignOut";
import { useList } from "@/hooks/useList";

type Props = { initialList: List };

export default function ListPage({ initialList }: Props) {
  const { data: list } = useList(initialList);
  const { tab } = useTabContext();
  const networkStatus = useNetworkStatus();

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

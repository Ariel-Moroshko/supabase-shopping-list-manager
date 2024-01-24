"use client";

import { List } from "@/types/List";
import AllItemsList from "./AllItemsList";
import { useTabContext } from "@/hooks/useTabContext";
import ShoppingList from "./ShoppingList";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useList } from "@/hooks/useList";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = { initialList: List; currentHost: string };

export default function ListPage({ initialList, currentHost }: Props) {
  const { data: list } = useList(initialList);
  const { tab } = useTabContext();
  const networkStatus = useNetworkStatus();

  if (list.categories.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <div>List is empty.</div>
        <Link href={`/lists/${list.id}/categories`}>
          <Button className="min-w-64">Add categories</Button>
        </Link>
      </div>
    );
  }
  return (
    <>
      {networkStatus === "offline" && (
        <div className="w-full rounded-md bg-red-500 py-3 text-center font-bold text-red-50 shadow-lg">
          No network connection
        </div>
      )}
      {tab === "allItems" ? (
        <AllItemsList list={list} currentHost={currentHost} />
      ) : (
        <ShoppingList list={list} />
      )}
    </>
  );
}

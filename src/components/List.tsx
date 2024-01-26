"use client";

import { List } from "@/types/List";
import AllItemsList from "./AllItemsList";
import { useTabContext } from "@/hooks/useTabContext";
import ShoppingList from "./ShoppingList";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useList } from "@/hooks/useList";
import { Dictionary, Language } from "@/lib/dictionaries";

type Props = {
  initialList: List;
  currentHost: string;
  dictionary: Dictionary["list_page"];
  language: Language;
};

export default function ListPage({
  initialList,
  currentHost,
  dictionary,
  language,
}: Props) {
  const { data: list } = useList(initialList);
  const { tab } = useTabContext();
  const networkStatus = useNetworkStatus();
  return (
    <>
      {networkStatus === "offline" && (
        <div className="mt-4 w-full rounded-md bg-red-500 py-3 text-center font-bold text-red-50 shadow-lg">
          {dictionary.no_network_connection}
        </div>
      )}
      {tab === "allItems" ? (
        <AllItemsList
          list={list}
          currentHost={currentHost}
          dictionary={dictionary}
          language={language}
        />
      ) : (
        <ShoppingList list={list} dictionary={dictionary} language={language} />
      )}
    </>
  );
}

"use client";

import { ReactNode, createContext, useState } from "react";

type ListTabContext = {
  tab: "allItems" | "shop";
  setTab: (tab: "allItems" | "shop") => void;
};
export const listTabContext = createContext<ListTabContext | null>(null);

export default function ListTabContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tab, setTab] = useState<"allItems" | "shop">("allItems");

  return (
    <listTabContext.Provider value={{ tab, setTab }}>
      {children}
    </listTabContext.Provider>
  );
}

"use client";

import { ReactNode, createContext, useState } from "react";

type TabContext = {
  tab: "allItems" | "shop";
  setTab: (tab: "allItems" | "shop") => void;
};
export const listTabContext = createContext<TabContext | null>(null);

export default function TabContextProvider({
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

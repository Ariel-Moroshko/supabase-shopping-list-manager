"use client";

import { useListTabContext } from "@/hooks/useListTabContext";
import { useTopNavTitleContext } from "@/hooks/useTopNavTitleContext";

export function BottomNav() {
  const { setTitle } = useTopNavTitleContext();
  const { setTab } = useListTabContext();

  const handleTabClick = (tab: "allItems" | "shop") => {
    setTitle(tab === "allItems" ? "All Items" : "Start Shopping");
    setTab(tab);
  };

  return (
    <div className="flex items-center justify-center gap-12">
      <button onClick={() => handleTabClick("allItems")}>All items</button>
      <button onClick={() => handleTabClick("shop")}>Shop</button>
    </div>
  );
}

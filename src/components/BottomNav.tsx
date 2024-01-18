"use client";

import { useTabContext } from "@/hooks/useTabContext";
import { useTopNavTitleContext } from "@/hooks/useTopNavTitleContext";

export function BottomNav() {
  const { setTitle } = useTopNavTitleContext();
  const { setTab } = useTabContext();

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

"use client";

import { useTabContext } from "@/hooks/useTabContext";
import { useTopNavTitleContext } from "@/hooks/useTopNavTitleContext";
import { List, ShoppingCart } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function BottomNav() {
  const { setTitle } = useTopNavTitleContext();
  const { tab, setTab } = useTabContext();

  const handleTabClick = (tab: "allItems" | "shop") => {
    setTitle(tab === "allItems" ? "All Items" : "Start Shopping");
    setTab(tab);
  };

  return (
    <div className="flex items-center justify-center gap-8">
      <button
        onClick={() => handleTabClick("allItems")}
        className="flex min-w-20 flex-col items-center justify-center gap-2 py-3 text-sm text-slate-800"
      >
        <span
          className={twMerge(
            "py-2",
            tab === "allItems" &&
              "rounded-full bg-slate-950 px-6 text-slate-100",
          )}
        >
          <List size={20} strokeWidth={2} />
        </span>
        <span
          className={twMerge(tab === "allItems" && "font-bold text-slate-950")}
        >
          All items
        </span>
      </button>
      <button
        onClick={() => handleTabClick("shop")}
        className="flex min-w-20 flex-col items-center justify-center gap-2 py-3 text-sm text-slate-800"
      >
        <span
          className={twMerge(
            "py-2",
            tab === "shop" && "rounded-full bg-slate-950 px-6  text-slate-100",
          )}
        >
          <ShoppingCart size={20} strokeWidth={2} />
        </span>
        <span className={twMerge(tab === "shop" && "font-bold text-slate-950")}>
          Shop
        </span>
      </button>
    </div>
  );
}

"use client";

import { useClearPickedUpItems } from "@/hooks/useClearPickedUpItems";
import { List } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  listId: number;
  setIsClearing: (b: boolean) => void;
  isActive: boolean;
};

export default function ClearPickedUpItems({
  listId,
  setIsClearing,
  isActive,
}: Props) {
  const queryClient = useQueryClient();
  const clearPickedUpItemsMutation = useClearPickedUpItems();
  const [error, setError] = useState("");
  const pending = clearPickedUpItemsMutation.isPending;

  const handleClear = () => {
    setError("");
    setIsClearing(true);
    clearPickedUpItemsMutation.mutate(listId, {
      onSuccess: () => {
        queryClient.setQueryData(["list", listId], (currentList: List) => {
          return {
            ...currentList,
            categories: currentList.categories.map((category) => ({
              ...category,
              items: category.items.map((it) => ({
                ...it,
                isPickedUp: it.isPickedUp ? false : it.isPickedUp,
                isInShoppingList: it.isPickedUp ? false : it.isInShoppingList,
                pickedUpAt: it.isPickedUp ? null : it.pickedUpAt,
              })),
            })),
          };
        });
      },
      onError: (error) => {
        setError(error.message);
      },
      onSettled: () => {
        setIsClearing(false);
      },
    });
  };

  return (
    <div>
      <button
        type="submit"
        onClick={() => handleClear()}
        disabled={pending || !isActive}
        className="w-fit border border-slate-800 px-8 py-4"
      >
        {pending ? "Clearing items..." : "Clear items"}
      </button>
      {error && <span className="font-bold text-red-600">Error: {error}</span>}
    </div>
  );
}

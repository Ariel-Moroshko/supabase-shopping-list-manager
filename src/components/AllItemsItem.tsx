"use client";

import { useAddItemToShoppingList } from "@/hooks/useAddItemToShoppingList";
import { Item, List } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Props = { listId: number; item: Item };

export default function AllItemsItem({ listId, item }: Props) {
  const queryClient = useQueryClient();
  const addItemToShoppingListMutation = useAddItemToShoppingList();
  const [error, setError] = useState("");
  const pending = addItemToShoppingListMutation.isPending;

  const handleAdd = () => {
    setError("");
    addItemToShoppingListMutation.mutate(item.id, {
      onSuccess: () => {
        queryClient.setQueryData(["list", listId], (currentList: List) => {
          return {
            ...currentList,
            categories: currentList.categories.map((category) => ({
              ...category,
              items: category.items.map((it) => ({
                ...it,
                isInShoppingList:
                  it.id === item.id ? true : it.isInShoppingList,
              })),
            })),
          };
        });
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  return (
    <li className="flex items-center">
      <span
        className={`flex-1 ${item.isPickedUp && "line-through decoration-red-600"}`}
      >
        {item.name}
      </span>
      {item.isInShoppingList ? (
        <div className="bg-emerald-200 px-4">Added!</div>
      ) : (
        <>
          <button
            className="bg-slate-300 px-2"
            onClick={() => handleAdd()}
            disabled={pending}
          >
            {pending ? "Adding..." : "Add"}
          </button>
          {error && (
            <span className="font-bold text-red-600">Error: {error}</span>
          )}
        </>
      )}
    </li>
  );
}

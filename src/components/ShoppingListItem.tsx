"use client";

import { usePickUpItem } from "@/hooks/usePickUpItem";
import { Item, List } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = { listId: number; item: Item };

export default function ShoppingListItem({ listId, item }: Props) {
  const queryClient = useQueryClient();
  const pickUpItemMutation = usePickUpItem();
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const pending = pickUpItemMutation.isPending;

  const handlePickUp = () => {
    setError("");
    pickUpItemMutation.mutate(item.id, {
      onSuccess: (pickUpTime: string) => {
        queryClient.setQueryData(["list", listId], (currentList: List) => {
          return {
            ...currentList,
            categories: currentList.categories.map((category) => ({
              ...category,
              items: category.items.map((it) => ({
                ...it,
                isPickedUp: it.id === item.id ? true : it.isPickedUp,
                pickedUpAt:
                  it.id === item.id ? new Date(pickUpTime) : it.pickedUpAt,
              })),
            })),
          };
        });
      },
      onError: (error) => {
        setError(error.message);
        setIsChecked(false);
      },
    });
  };

  return (
    <li className="flex min-h-7 items-center">
      <input
        type="checkbox"
        className="h-5 w-5"
        id={`shoppingListItem-${item.id}`}
        value={item.id}
        onClick={() => handlePickUp()}
        disabled={pending}
        checked={isChecked}
        onChange={(e) => setIsChecked(e.currentTarget.checked)}
      />
      {error && <span className="font-bold text-red-600">Error: {error}</span>}
      <label
        htmlFor={`shoppingListItem-${item.id}`}
        className={twMerge(
          "pe-6 ps-4",
          pending && "line-through decoration-red-600",
        )}
      >
        {item.name}
      </label>
    </li>
  );
}

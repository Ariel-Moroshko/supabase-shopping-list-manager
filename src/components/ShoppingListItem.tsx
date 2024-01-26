"use client";

import { usePickUpItem } from "@/hooks/usePickUpItem";
import { Language } from "@/lib/dictionaries";
import { Item, List } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = { listId: number; item: Item; language: Language };

export default function ShoppingListItem({ listId, item, language }: Props) {
  const queryClient = useQueryClient();
  const pickUpItemMutation = usePickUpItem(language);
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
    <li
      className={twMerge(
        "group flex min-h-7 items-center",
        isChecked && "checked",
      )}
    >
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
      <div className="flex-1 pe-6">
        <label
          htmlFor={`shoppingListItem-${item.id}`}
          className="inline-block px-4"
        >
          <span
            className={twMerge(
              "bg-gradient-to-b from-red-600 to-red-600 bg-[length:0%_2px] bg-no-repeat transition-all duration-300 ease-out group-[.checked]:bg-[length:100%_2px]",
              language === "he" ? "bg-[right_center]" : "bg-[left_center]",
            )}
          >
            <span className="break-all">{item.name}</span>
            {item.note && (
              <span className="ms-4 break-all italic">{item.note}</span>
            )}
          </span>
        </label>
      </div>
    </li>
  );
}

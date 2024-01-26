"use client";

import { useAddItemToShoppingList } from "@/hooks/useAddItemToShoppingList";
import { Item, List } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import ItemNote from "./ItemNote";
import { Dictionary, Language } from "@/lib/dictionaries";
import { twMerge } from "tailwind-merge";

type Props = {
  listId: number;
  item: Item;
  language: Language;
  dictionary: Dictionary["list_page"];
};

export default function AllItemsItem({
  listId,
  item,
  language,
  dictionary,
}: Props) {
  const queryClient = useQueryClient();
  const addItemToShoppingListMutation = useAddItemToShoppingList(language);
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
      <div className="flex flex-1 gap-4 pe-4">
        <span
          className={twMerge(
            "break-all",
            item.isPickedUp && "line-through decoration-red-600",
          )}
        >
          {item.name}
        </span>
        <span
          className={twMerge(
            "break-all italic",
            item.isPickedUp && "line-through decoration-red-600",
          )}
        >
          {item.note}
        </span>
      </div>
      <div className="flex items-center justify-center gap-3">
        {item.isInShoppingList ? (
          <div className="flex h-8 items-center justify-center rounded-md border border-slate-200 bg-emerald-100 px-2 py-0 hover:bg-emerald-100 ">
            <Check size={16} />
          </div>
        ) : (
          <>
            <Button
              onClick={() => handleAdd()}
              variant="outline"
              className="h-8 px-2 py-0"
            >
              {pending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Plus size={16} />
              )}
            </Button>
            {error && (
              <span className="font-bold text-red-600">
                {dictionary.error}: {error}
              </span>
            )}
          </>
        )}
        <ItemNote
          listId={listId}
          item={item}
          language={language}
          dictionary={dictionary}
        />
      </div>
    </li>
  );
}

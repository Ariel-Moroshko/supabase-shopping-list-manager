"use client";

import { useClearPickedUpItems } from "@/hooks/useClearPickedUpItems";
import { List } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Dictionary, Language } from "@/lib/dictionaries";

type Props = {
  listId: number;
  setIsClearing: (b: boolean) => void;
  isActive: boolean;
  language: Language;

  dictionary: Dictionary["list_page"];
};

export default function ClearPickedUpItems({
  listId,
  setIsClearing,
  isActive,
  language,
  dictionary,
}: Props) {
  const queryClient = useQueryClient();
  const clearPickedUpItemsMutation = useClearPickedUpItems(language);
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
      <Button
        type="submit"
        onClick={() => handleClear()}
        disabled={pending || !isActive}
        variant="destructive"
        className="flex min-w-32 items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>{dictionary.clearing_items}...</span>
          </>
        ) : (
          dictionary.clear_items
        )}
      </Button>
      {error && (
        <span className="font-bold text-red-600">
          {dictionary.error}: {error}
        </span>
      )}
    </div>
  );
}

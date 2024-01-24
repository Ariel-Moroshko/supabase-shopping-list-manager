"use client";

import { useUndoPickedUpItem } from "@/hooks/useUndoPickedUpItem";
import { Item, List } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  listId: number;
  lastPickedUpItemId: number;
  setIsUndoing: (b: boolean) => void;
  isActive: boolean;
};

export default function UndoPickedUpItem({
  listId,
  lastPickedUpItemId,
  setIsUndoing,
  isActive,
}: Props) {
  const queryClient = useQueryClient();
  const undoPickedUpItemMutation = useUndoPickedUpItem();
  const [error, setError] = useState("");
  const pending = undoPickedUpItemMutation.isPending;

  const handleUndo = () => {
    setError("");
    setIsUndoing(true);
    undoPickedUpItemMutation.mutate(lastPickedUpItemId, {
      onSuccess: () => {
        queryClient.setQueryData(["list", listId], (currentList: List) => {
          return {
            ...currentList,
            categories: currentList.categories.map((category) => ({
              ...category,
              items: category.items.map((it) => ({
                ...it,
                isPickedUp:
                  it.id === lastPickedUpItemId ? false : it.isPickedUp,
                pickedUpAt: it.id === lastPickedUpItemId ? null : it.pickedUpAt,
              })),
            })),
          };
        });
      },
      onError: (error) => {
        setError(error.message);
      },
      onSettled: () => {
        setIsUndoing(false);
      },
    });
  };
  return (
    <div>
      <Button
        onClick={() => handleUndo()}
        variant="outline"
        disabled={pending || !isActive}
        className="flex min-w-32 items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Undoing...</span>
          </>
        ) : (
          "Undo"
        )}
      </Button>
      {error && <span className="font-bold text-red-600">Error: {error}</span>}
    </div>
  );
}

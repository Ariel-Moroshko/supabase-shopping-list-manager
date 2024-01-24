import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { Loader2, Pen } from "lucide-react";
import { Input } from "./ui/input";
import { Item, List } from "@/types/List";
import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEditNote } from "@/hooks/useEditNote";

type Props = { listId: number; item: Item };

export default function ItemNote({ listId, item }: Props) {
  const [note, setNote] = useState(item.note);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const editNoteMutation = useEditNote();
  const [error, setError] = useState("");
  const pending = editNoteMutation.isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    editNoteMutation.mutate(
      { itemId: item.id, note: note.trim() },
      {
        onSuccess: () => {
          queryClient.setQueryData(["list", listId], (currentList: List) => {
            return {
              ...currentList,
              categories: currentList.categories.map((category) => ({
                ...category,
                items: category.items.map((it) => ({
                  ...it,
                  note: it.id === item.id ? note.trim() : it.note,
                })),
              })),
            };
          });
          setIsOpen(false);
        },
        onError: (error) => {
          setError(error.message);
        },
      },
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setNote(item.note);
            setError("");
          }}
          variant="outline"
          className="h-8 px-2 py-0"
        >
          <Pen size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-0 translate-y-0">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-4" disabled={pending}>
            <div className="flex flex-col gap-2">
              <label htmlFor="note" className="font-medium">
                Note for {item.name}:
              </label>
              <Input
                type="text"
                id="note"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            {error && (
              <span className="font-bold text-red-600">Error: {error}</span>
            )}
            <div className="flex justify-between">
              <Button type="submit" className="flex min-w-32 gap-2">
                {pending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}

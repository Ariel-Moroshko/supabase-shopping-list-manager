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
import { Dictionary, Language } from "@/lib/dictionaries";

type Props = {
  listId: number;
  item: Item;
  language: Language;
  dictionary: Dictionary["list_page"];
};

export default function ItemNote({
  listId,
  item,
  language,
  dictionary,
}: Props) {
  const [note, setNote] = useState(item.note);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const editNoteMutation = useEditNote(language);
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
          <DialogTitle className="text-center">
            {dictionary.edit_note}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-4" disabled={pending}>
            <div className="flex flex-col gap-2">
              <label htmlFor="note" className="font-medium">
                {dictionary.note_for} {item.name}:
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
              <span className="font-bold text-red-600">
                {dictionary.error}: {error}
              </span>
            )}
            <div className="flex justify-between">
              <Button type="submit" className="flex min-w-32 gap-2">
                {pending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>{dictionary.saving}...</span>
                  </>
                ) : (
                  dictionary.save
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => setIsOpen(false)}
              >
                {dictionary.cancel}
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}

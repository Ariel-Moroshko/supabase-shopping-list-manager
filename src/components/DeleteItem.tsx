import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { Item, List } from "@/types/List";
import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import { Dictionary, Language } from "@/lib/dictionaries";

type Props = {
  listId: number;
  item: Item;
  lang: Language;
  dictionary: Dictionary["items_page"];
};

export default function DeleteItem({ listId, item, lang, dictionary }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteItemMutation = useDeleteItem(lang);
  const [error, setError] = useState("");
  const pending = deleteItemMutation.isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    deleteItemMutation.mutate(item.id, {
      onSuccess: () => {
        queryClient.setQueryData([listId, "items"], (currentList: List) => {
          return {
            ...currentList,
            categories: currentList.categories.map((category) => ({
              ...category,
              items: category.items.filter((it) => it.id !== item.id),
            })),
          };
        });
        setIsOpen(false);
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setError("")}
          variant="outline"
          className="h-8 px-2 py-0"
        >
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-0 translate-y-0">
        <DialogHeader>
          <DialogTitle className="text-center">
            {dictionary.delete_item}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-4" disabled={pending}>
            <div className="break-all">
              {dictionary.delete_item_description}
              <span className="font-bold"> {item.name}</span>?
            </div>
            {error && (
              <span className="font-bold text-red-600">
                {dictionary.error}: {error}
              </span>
            )}
            <div className="flex justify-between">
              <Button
                variant="destructive"
                type="submit"
                className="flex min-w-32 gap-2"
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>{dictionary.deleting}...</span>
                  </>
                ) : (
                  dictionary.delete
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

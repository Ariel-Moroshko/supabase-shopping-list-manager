import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { Loader2, Pencil } from "lucide-react";
import { Input } from "./ui/input";
import { Item, List } from "@/types/List";
import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dictionary, Language } from "@/lib/dictionaries";
import { useEditItemName } from "@/hooks/useEditItemName";

type Props = {
  listId: number;
  item: Item;
  lang: Language;
  dictionary: Dictionary["items_page"];
};

export default function EditItemName({
  listId,
  item,
  lang,
  dictionary,
}: Props) {
  const [itemName, setItemName] = useState(item.name);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const editItemNameMutation = useEditItemName(lang);
  const [error, setError] = useState("");
  const pending = editItemNameMutation.isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (itemName.trim() === item.name) {
      setIsOpen(false);
      return;
    }
    editItemNameMutation.mutate(
      { itemId: item.id, itemName: itemName.trim() },
      {
        onSuccess: () => {
          queryClient.setQueryData([listId, "items"], (currentList: List) => {
            return {
              ...currentList,
              categories: currentList.categories.map((category) => ({
                ...category,
                items: category.items.map((it) => ({
                  ...it,
                  name: it.id === item.id ? itemName.trim() : it.name,
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
            setError("");
            setItemName(item.name);
          }}
          variant="outline"
          className="h-8 px-2 py-0"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-0 translate-y-0">
        <DialogHeader>
          <DialogTitle className="text-center">
            {dictionary.edit_item}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-4" disabled={pending}>
            <div className="flex flex-col gap-2">
              <label htmlFor="newItemName" className="font-medium">
                {dictionary.item_name}:
              </label>
              <Input
                type="text"
                id="newItemName"
                name="newItemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
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

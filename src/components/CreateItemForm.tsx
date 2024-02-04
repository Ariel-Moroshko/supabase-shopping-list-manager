"use client";

import { Item, List } from "@/types/List";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { useCreateItem } from "@/hooks/useCreateItem";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dictionary, Language } from "@/lib/dictionaries";

type Props = {
  list: List;
  lang: Language;
  dictionary: Dictionary["items_page"];
};

export default function CreateItemForm({ list, lang, dictionary }: Props) {
  const queryClient = useQueryClient();
  const createItemMutation = useCreateItem(lang);
  const [error, setError] = useState("");
  const [itemName, setItemName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryError, setCategoryError] = useState(false);
  const pending = createItemMutation.isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setCategoryError(false);
    if (!itemName.trim()) {
      return;
    } else if (!categoryId) {
      setCategoryError(true);
      return;
    }
    createItemMutation.mutate(
      { listId: list.id, categoryId, itemName: itemName.trim() },
      {
        onSuccess: (newItem: Item) => {
          queryClient.setQueryData([list.id, "items"], (currentList: List) => {
            return {
              ...currentList,
              categories: currentList.categories.map((category) => {
                const newCategory = {
                  ...category,
                  items: category.items.map((item) => ({ ...item })),
                };
                if (category.id === newItem.categoryId) {
                  newCategory.items.push(newItem);
                }
                return newCategory;
              }),
            };
          });
          setItemName("");
        },
        onError: (error) => {
          setError(error.message);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-md bg-blue-50 px-6 py-6 shadow-sm"
    >
      <h2 className="text-lg font-medium">{dictionary.create_new_item}</h2>
      <fieldset disabled={pending} className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="itemName" className="font-medium">
              {dictionary.item_name}:
            </label>
            <Input
              type="text"
              id="itemName"
              name="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="flex-1"
              required
            />
          </div>
          <div>
            <label className="flex flex-col gap-1">
              <span className="font-medium">{dictionary.category}:</span>
              <Select
                dir={lang === "he" ? "rtl" : "ltr"}
                name="categoryId"
                value={categoryId ? String(categoryId) : ""}
                onValueChange={(newValue) => setCategoryId(Number(newValue))}
                required
              >
                <SelectTrigger
                  className={categoryError ? "border-red-600" : ""}
                >
                  <SelectValue placeholder={dictionary.choose_category} />
                </SelectTrigger>
                <SelectContent
                  id="categoryId"
                  // https://github.com/radix-ui/primitives/issues/1658#issuecomment-1714105445
                  ref={(ref) => {
                    if (!ref) return;
                    ref.ontouchstart = (e) => {
                      e.preventDefault();
                    };
                  }}
                >
                  <SelectGroup className="max-h-[200px] overflow-y-auto">
                    {list.categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
          </div>
        </div>
        {error && (
          <div className="font-bold text-red-600">
            {dictionary.error}: {error}
          </div>
        )}
        <Button
          type="submit"
          className="flex items-center justify-center gap-2"
        >
          {pending ? (
            <>
              <Loader2 className="animate-spin" />
              <span>{dictionary.creating_item}...</span>
            </>
          ) : (
            dictionary.create_item
          )}
        </Button>
      </fieldset>
    </form>
  );
}

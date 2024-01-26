import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Category, CategoryWithoutItems } from "@/types/List";
import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dictionary, Language } from "@/lib/dictionaries";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";

type Props = {
  listId: number;
  category: CategoryWithoutItems;
  lang: Language;
  dictionary: Dictionary["categories_page"];
};

export default function DeleteCategory({
  listId,
  category,
  lang,
  dictionary,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteCategoryMutation = useDeleteCategory(lang);
  const [error, setError] = useState("");
  const pending = deleteCategoryMutation.isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    deleteCategoryMutation.mutate(category.id, {
      onSuccess: () => {
        queryClient.setQueryData(
          [listId, "categories"],
          (categories: CategoryWithoutItems[]) => {
            return categories.filter((c) => c.id !== category.id);
          },
        );
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
            {dictionary.delete_category}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-4" disabled={pending}>
            <div className="break-all">
              {dictionary.delete_category_description}
              <span className="font-bold"> {category.name}</span>?
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

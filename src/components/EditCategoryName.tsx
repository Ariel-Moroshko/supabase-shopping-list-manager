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
import { CategoryWithoutItems } from "@/types/List";
import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEditCategoryName } from "@/hooks/useEditCategoryName";

type Props = { listId: number; category: CategoryWithoutItems };

export default function EditCategoryName({ listId, category }: Props) {
  const [categoryName, setCategoryName] = useState(category.name);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const editCategoryNameMutation = useEditCategoryName();
  const [error, setError] = useState("");
  const pending = editCategoryNameMutation.isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (categoryName.trim() === category.name) {
      setIsOpen(false);
      return;
    }
    editCategoryNameMutation.mutate(
      { categoryId: category.id, categoryName: categoryName.trim() },
      {
        onSuccess: () => {
          queryClient.setQueryData(
            [listId, "categories"],
            (categories: CategoryWithoutItems[]) => {
              return categories.map((c) => ({
                ...c,
                name: c.id === category.id ? categoryName.trim() : c.name,
              }));
            },
          );
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
            setCategoryName(category.name);
          }}
          variant="outline"
          className="h-8 px-2 py-0"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-0 translate-y-0">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-4" disabled={pending}>
            <div className="flex flex-col gap-2">
              <label htmlFor="note" className="font-medium">
                Category name:
              </label>
              <Input
                type="text"
                id="categoryName"
                name="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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

"use client";

import CreateCategoryForm from "@/components/CreateCategoryForm";
import { useCategories } from "@/hooks/useCategories";
import { CategoryWithoutItems } from "@/types/List";
import { useState } from "react";
import { Button } from "./ui/button";
import { DraggableCategories } from "./DraggableCategories";
import EditCategoryName from "./EditCategoryName";

type Props = {
  listId: number;
  initialCategories: CategoryWithoutItems[];
};
export default function CategoriesPage({ listId, initialCategories }: Props) {
  const [isChangingOrder, setIsChangingOrder] = useState(false);
  const { data: categories } = useCategories(listId, initialCategories);

  return (
    <div className="px-4 py-8">
      {isChangingOrder && (
        <>
          <DraggableCategories
            listId={listId}
            categories={categories}
            setIsChangingOrder={setIsChangingOrder}
          />
        </>
      )}
      {!isChangingOrder && (
        <div className="flex flex-col">
          <Button
            variant="secondary"
            className="mb-8 font-bold"
            onClick={() => setIsChangingOrder(true)}
          >
            Change order
          </Button>

          <CreateCategoryForm listId={listId} />

          <ol className="mt-8 flex flex-col gap-2 divide-y">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center px-4 py-1">
                <div className="flex-1">{category.name}</div>
                <EditCategoryName listId={listId} category={category} />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

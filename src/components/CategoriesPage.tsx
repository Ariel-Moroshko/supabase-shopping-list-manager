"use client";

import CreateCategoryForm from "@/components/CreateCategoryForm";
import { useCategories } from "@/hooks/useCategories";
import { CategoryWithoutItems } from "@/types/List";

type Props = {
  listId: number;
  initialCategories: CategoryWithoutItems[];
};
export default function CategoriesPage({ listId, initialCategories }: Props) {
  const { data: categories } = useCategories(listId, initialCategories);
  return (
    <div className="px-8 py-8">
      <CreateCategoryForm listId={listId} />
      {/* {categories.length > 0 && (
        <DraggableCategories listId={listId} categories={categories} />
      )} */}
      <ol className="flex flex-col gap-2 bg-slate-100">
        {categories.map((category) => (
          <li key={category.id} className="bg-blue-100 py-3">
            {category.name}
          </li>
        ))}
      </ol>
    </div>
  );
}

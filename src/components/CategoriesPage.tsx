"use client";

import CreateCategoryForm from "@/components/CreateCategoryForm";
import { useCategories } from "@/hooks/useCategories";
import { CategoryWithoutItems } from "@/types/List";
import { useState } from "react";
import { Button } from "./ui/button";
import { DraggableCategories } from "./DraggableCategories";
import EditCategoryName from "./EditCategoryName";
import { Dictionary, Language } from "@/lib/dictionaries";
import { ArrowDownUp } from "lucide-react";
import DeleteCategory from "./DeleteCategory";

type Props = {
  listId: number;
  initialCategories: CategoryWithoutItems[];
  lang: Language;
  dictionary: Dictionary["categories_page"];
};
export default function CategoriesPage({
  listId,
  initialCategories,
  lang,
  dictionary,
}: Props) {
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
            lang={lang}
            dictionary={dictionary}
          />
        </>
      )}
      {!isChangingOrder && (
        <div className="flex flex-col">
          <Button
            variant="secondary"
            className="mb-8 flex items-center justify-center gap-2 shadow"
            onClick={() => setIsChangingOrder(true)}
          >
            <ArrowDownUp size={16} />
            <span>{dictionary.change_order}</span>
          </Button>

          <CreateCategoryForm
            listId={listId}
            lang={lang}
            dictionary={dictionary}
          />

          <ol className="mt-8 flex flex-col gap-2 divide-y">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center px-4 py-1">
                <div className="flex flex-1 pe-4">
                  <span className="break-all">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EditCategoryName
                    listId={listId}
                    category={category}
                    lang={lang}
                    dictionary={dictionary}
                  />
                  <DeleteCategory
                    listId={listId}
                    category={category}
                    lang={lang}
                    dictionary={dictionary}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

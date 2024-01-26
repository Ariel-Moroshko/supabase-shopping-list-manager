import { Category } from "@/types/List";
import ShoppingListItem from "./ShoppingListItem";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Language } from "@/lib/dictionaries";
import { twMerge } from "tailwind-merge";

type Props = { listId: number; category: Category; language: Language };

export default function ShoppingListCategory({
  listId,
  category,
  language,
}: Props) {
  return (
    <AccordionItem value={category.id.toString()}>
      <AccordionTrigger
        className={twMerge(
          "break-all text-left hover:no-underline",
          language === "he" && "text-right",
        )}
      >
        <span className="flex w-full items-center justify-between pe-4">
          <span className="flex-1 pe-4 hover:underline">{category.name}</span>
          <span className="min-w-12 rounded-full bg-blue-100 text-center text-blue-700">
            {category.items.length}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <ol className="ms-6 flex flex-col gap-3">
          {category.items.map((item) => (
            <ShoppingListItem
              key={item.id}
              listId={listId}
              item={item}
              language={language}
            />
          ))}
        </ol>
      </AccordionContent>
    </AccordionItem>
  );
}

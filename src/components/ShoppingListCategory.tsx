import { Category } from "@/types/List";
import ShoppingListItem from "./ShoppingListItem";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type Props = { listId: number; category: Category };

export default function ShoppingListCategory({ listId, category }: Props) {
  return (
    <AccordionItem value={category.id.toString()}>
      <AccordionTrigger className="hover:no-underline">
        <span className="me-6 flex w-full items-center justify-between">
          <span className="hover:underline">{category.name}</span>
          <span className="min-w-12 rounded-full bg-blue-100 text-blue-700 ">
            {category.items.length}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <ol className="ms-6 flex flex-col gap-3">
          {category.items.map((item) => (
            <ShoppingListItem key={item.id} listId={listId} item={item} />
          ))}
        </ol>
      </AccordionContent>
    </AccordionItem>
  );
}

import { Category } from "@/types/List";
import AllItemsItem from "./AllItemsItem";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type Props = { listId: number; category: Category };

export default function AllItemsCategory({ listId, category }: Props) {
  return (
    <AccordionItem value={category.id.toString()}>
      <AccordionTrigger>{category.name}</AccordionTrigger>
      <AccordionContent>
        <ol className="ms-6 flex flex-col gap-2 pe-1 pt-1">
          {category.items.map((item) => (
            <AllItemsItem key={item.id} listId={listId} item={item} />
          ))}
        </ol>
      </AccordionContent>
    </AccordionItem>
  );
}

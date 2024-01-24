"use client";

import { List } from "@/types/List";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useItems } from "@/hooks/useItems";
import CreateItemForm from "./CreateItemForm";
import DeleteItem from "./DeleteItem";

type Props = {
  initialList: List;
};
export default function ItemsPage({ initialList }: Props) {
  const { data: list } = useItems(initialList);

  return (
    <div className="px-4 py-8">
      <div className="flex flex-col">
        <CreateItemForm list={list} />
        <Accordion
          type="multiple"
          defaultValue={list.categories.map((c) => c.id.toString())}
        >
          {list.categories
            .filter((c) => c.items.length > 0)
            .map((category) => (
              <AccordionItem value={category.id.toString()} key={category.id}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent>
                  <ol className="ms-6 flex flex-col gap-2">
                    {category.items.map((item) => (
                      <li key={item.id} className="flex items-center py-1">
                        <div className="flex-1">{item.name}</div>
                        <DeleteItem listId={list.id} item={item} />
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}

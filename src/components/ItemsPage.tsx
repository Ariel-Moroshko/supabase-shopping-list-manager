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
import { Dictionary, Language } from "@/lib/dictionaries";
import { twMerge } from "tailwind-merge";
import EditItemName from "./EditItemName";

type Props = {
  initialList: List;
  lang: Language;
  dictionary: Dictionary["items_page"];
};
export default function ItemsPage({ initialList, lang, dictionary }: Props) {
  const { data: list } = useItems(initialList);

  return (
    <div className="px-4 pt-8">
      <div className="flex flex-col">
        <CreateItemForm list={list} lang={lang} dictionary={dictionary} />
        <Accordion
          type="multiple"
          defaultValue={list.categories.map((c) => c.id.toString())}
        >
          {list.categories.map((category) => (
            <AccordionItem value={category.id.toString()} key={category.id}>
              <AccordionTrigger
                className={twMerge(
                  "break-all text-left",
                  lang === "he" && "text-right",
                )}
              >
                <span className="pe-4">{category.name}</span>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="ms-6 flex flex-col gap-2">
                  {category.items.map((item) => (
                    <li key={item.id} className="flex items-center py-1">
                      <div className="flex flex-1 pe-4">
                        <span className="break-all">{item.name}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <EditItemName
                          listId={list.id}
                          item={item}
                          lang={lang}
                          dictionary={dictionary}
                        />
                        <DeleteItem
                          listId={list.id}
                          item={item}
                          lang={lang}
                          dictionary={dictionary}
                        />
                      </div>
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

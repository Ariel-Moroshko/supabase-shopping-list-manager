import { Category } from "@/types/List";
import AllItemsItem from "./AllItemsItem";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Dictionary, Language } from "@/lib/dictionaries";
import { twMerge } from "tailwind-merge";

type Props = {
  listId: number;
  category: Category;
  language: Language;
  dictionary: Dictionary["list_page"];
};

export default function AllItemsCategory({
  listId,
  category,
  language,
  dictionary,
}: Props) {
  return (
    <AccordionItem value={category.id.toString()}>
      <AccordionTrigger
        className={twMerge(
          "break-all text-left",
          language === "he" && "text-right",
        )}
      >
        <span className="pe-4">{category.name}</span>
      </AccordionTrigger>
      <AccordionContent>
        <ol className="ms-6 flex flex-col gap-2 pe-1 pt-1">
          {category.items.map((item) => (
            <AllItemsItem
              key={item.id}
              listId={listId}
              item={item}
              language={language}
              dictionary={dictionary}
            />
          ))}
        </ol>
      </AccordionContent>
    </AccordionItem>
  );
}

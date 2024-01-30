import { Item } from "@/types/List";
import PickedUpItemsActions from "./PickedUpItemsActions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Dictionary, Language } from "@/lib/dictionaries";
import { useEffect, useRef } from "react";

type Props = {
  listId: number;
  items: Item[];
  isCheckedItemsOpen: boolean;
  setIsCheckedItemsOpen: (b: boolean) => void;
  language: Language;
  dictionary: Dictionary["list_page"];
};

export default function PickedUpItems({
  listId,
  items,
  isCheckedItemsOpen,
  setIsCheckedItemsOpen,
  language,
  dictionary,
}: Props) {
  const pickedUpActionButtonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollTimeoutId = 0;
    if (isCheckedItemsOpen) {
      scrollTimeoutId = window.setTimeout(() => {
        pickedUpActionButtonsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
    return () => {
      window.clearTimeout(scrollTimeoutId);
    };
  }, [isCheckedItemsOpen]);

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-blue-50 px-4"
      defaultValue={isCheckedItemsOpen ? "checkedItems" : ""}
      value={isCheckedItemsOpen ? "checkedItems" : ""}
      onValueChange={(value) => {
        if (value) {
          setIsCheckedItemsOpen(true);
        } else {
          setIsCheckedItemsOpen(false);
        }
      }}
    >
      <AccordionItem value="checkedItems">
        <AccordionTrigger className="hover:no-underline [&[data-state=closed]>svg]:rotate-180 [&[data-state=open]>svg]:rotate-0">
          <span className="me-6 flex w-full items-center justify-between">
            <span className="hover:underline">{dictionary.checked_items}</span>
            <span className="min-w-12 rounded-full bg-red-500 text-red-50 ">
              {items.length}
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ol className="mb-4 flex flex-col gap-4 px-4">
            {items.map((item) => (
              <li key={item.id} className="line-through decoration-red-500">
                {item.name}
              </li>
            ))}
          </ol>
          <PickedUpItemsActions
            listId={listId}
            lastPickedUpItemId={items.at(-1)?.id!}
            language={language}
            dictionary={dictionary}
            ref={pickedUpActionButtonsRef}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

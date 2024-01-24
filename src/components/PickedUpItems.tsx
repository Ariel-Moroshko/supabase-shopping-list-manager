import { Item } from "@/types/List";
import PickedUpItemsActions from "./PickedUpItemsActions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type Props = {
  listId: number;
  items: Item[];
  isCheckedItemsOpen: boolean;
  setIsCheckedItemsOpen: (b: boolean) => void;
};

export default function PickedUpItems({
  listId,
  items,
  isCheckedItemsOpen,
  setIsCheckedItemsOpen,
}: Props) {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-blue-50 px-4"
      defaultValue={isCheckedItemsOpen ? "checkedItems" : ""}
      value={isCheckedItemsOpen ? "checkedItems" : ""}
      onValueChange={(value) =>
        value ? setIsCheckedItemsOpen(true) : setIsCheckedItemsOpen(false)
      }
    >
      <AccordionItem value="checkedItems">
        <AccordionTrigger className="hover:no-underline">
          <span className="me-6 flex w-full items-center justify-between">
            <span className="hover:underline">Checked items</span>
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
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    // <div className="sticky bottom-0 flex flex-col rounded-md bg-slate-50 px-2 py-4 shadow-sm">
    //   <div className="flex items-end gap-8">
    //     <h2 className="font-medium text-slate-700">Checked</h2>
    //   </div>
    //   <ol className="my-4 flex flex-col gap-4 px-4">
    //     {items.map((item) => (
    //       <li key={item.id} className="line-through decoration-red-500">
    //         {item.name}
    //       </li>
    //     ))}
    //   </ol>
    //   <PickedUpItemsActions
    //     listId={listId}
    //     lastPickedUpItemId={items.at(-1)?.id!}
    //   />
    // </div>
  );
}

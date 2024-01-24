import { Item, List } from "@/types/List";
import ShoppingListCategory from "./ShoppingListCategory";
import PickedUpItems from "./PickedUpItems";
import { Accordion } from "@radix-ui/react-accordion";
import { useEffect, useMemo, useState } from "react";

type Props = { list: List };

export default function ShoppingList({ list }: Props) {
  const unCheckedList: List = useMemo(() => {
    return {
      ...list,
      categories: list.categories
        .map((category) => ({
          ...category,
          items: category.items.filter(
            (item) => item.isInShoppingList && !item.isPickedUp,
          ),
        }))
        .filter((category) => category.items.length > 0),
    };
  }, [list]);

  const checkedItems = useMemo(() => {
    return list.categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.isPickedUp),
      }))
      .filter((category) => category.items.length > 0)
      .reduce((acc: Item[], curr) => acc.concat(curr.items), [])
      .sort((item1, item2) => (item1.pickedUpAt! < item2.pickedUpAt! ? -1 : 1));
  }, [list]);

  const [isCheckedItemsOpen, setIsCheckedItemsOpen] = useState(
    unCheckedList.categories.length === 0,
  );

  useEffect(() => {
    if (unCheckedList.categories.length === 0) {
      setIsCheckedItemsOpen(true);
    }
  }, [unCheckedList]);

  return (
    <div className="flex flex-1 flex-col">
      {unCheckedList.categories.length === 0 && checkedItems.length === 0 && (
        <div className="mt-6 flex justify-center">
          No items in shopping list
        </div>
      )}
      {unCheckedList.categories.length > 0 && (
        <Accordion type="multiple" className="flex-1 px-4">
          {unCheckedList.categories.map((category) => (
            <ShoppingListCategory
              key={category.id}
              listId={list.id}
              category={category}
            />
          ))}
        </Accordion>
      )}
      {checkedItems.length > 0 && (
        <PickedUpItems
          listId={list.id}
          items={checkedItems}
          isCheckedItemsOpen={isCheckedItemsOpen}
          setIsCheckedItemsOpen={setIsCheckedItemsOpen}
        />
      )}
    </div>
  );
}

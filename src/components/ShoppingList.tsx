import { Item, List } from "@/types/List";
import ShoppingListCategory from "./ShoppingListCategory";
import PickedUpItems from "./PickedUpItems";

type Props = { list: List };

export default function ShoppingList({ list }: Props) {
  const unCheckedList: List = {
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

  const checkedItems = list.categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.isPickedUp),
    }))
    .filter((category) => category.items.length > 0)
    .reduce((acc: Item[], curr) => acc.concat(curr.items), [])
    .sort((item1, item2) => (item1.pickedUpAt! < item2.pickedUpAt! ? -1 : 1));

  return (
    <>
      <ol className="flex flex-1 flex-col gap-4 divide-y">
        {unCheckedList.categories.map((category) => (
          <ShoppingListCategory
            key={category.id}
            listId={list.id}
            category={category}
          />
        ))}
      </ol>
      {checkedItems.length > 0 && (
        <PickedUpItems listId={list.id} items={checkedItems} />
      )}
    </>
  );
}

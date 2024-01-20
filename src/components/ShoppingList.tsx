import { Item, List } from "@/types/List";
import ShoppingListCategory from "./ShoppingListCategory";
import ClearPickedUpItemsForm from "./ClearPickedUpItemsForm";
import CancelLastPickedUpItem from "./CancelLastPickedUpItem";

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
        <div className="mt-8 flex flex-col">
          <div className="flex gap-8 border-t-2">
            <h2 className="font-bold">Checked</h2>
            <CancelLastPickedUpItem listId={list.id} />
          </div>
          <ClearPickedUpItemsForm listId={list.id} />
          <ol className="flex flex-col gap-2">
            {checkedItems.map((item) => (
              <li
                key={item.id}
                className="decoration- line-through decoration-red-500"
              >
                {item.name}
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}

import { Item, List } from "@/types/List";
import ShoppingListCategory from "./ShoppingListCategory";
import ClearPickedUpItemsForm from "./ClearPickedUpItemsForm";

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
    .reduce((acc: Item[], curr) => acc.concat(curr.items), []);
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
          <h2 className="border-t-2 font-bold">Checked</h2>
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

import { List } from "@/types/List";
import AllItemsCategory from "./AllItemsCategory";

type Props = { list: List };

export default function AllItemsList({ list }: Props) {
  return (
    <ol className="flex flex-1 flex-col gap-4 divide-y">
      {list?.categories.map((category) => (
        <AllItemsCategory
          key={category.id}
          listId={list.id}
          category={category}
        />
      ))}
    </ol>
  );
}

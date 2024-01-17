import { Category } from "@/types/List";
import AllItemsItem from "./AllItemsItem";

type Props = { listId: number; category: Category };

export default function AllItemsCategory({ listId, category }: Props) {
  return (
    <li>
      <details open>
        <summary>{category.name}</summary>
        <ol className="ms-6 flex flex-col gap-2">
          {category.items.map((item) => (
            <AllItemsItem key={item.id} listId={listId} item={item} />
          ))}
        </ol>
      </details>
    </li>
  );
}

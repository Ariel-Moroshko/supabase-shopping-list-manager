import { Category } from "@/types/List";
import ShoppingListItem from "./ShoppingListItem";

type Props = { category: Category };

export default function ShoppingListCategory({ category }: Props) {
  return (
    <li>
      <details open>
        <summary>{category.name}</summary>
        <ol className="ms-6 flex flex-col gap-2">
          {category.items.map((item) => (
            <ShoppingListItem key={item.id} item={item} />
          ))}
        </ol>
      </details>
    </li>
  );
}

import { Item } from "@/types/List";
import PickedUpItemsActions from "./PickedUpItemsActions";

type Props = { listId: number; items: Item[] };

export default function PickedUpItems({ listId, items }: Props) {
  return (
    <div className="mt-8 flex flex-col">
      <div className="flex gap-8 border-t-2">
        <h2 className="font-bold">Checked</h2>
        <PickedUpItemsActions
          listId={listId}
          lastPickedUpItemId={items.at(-1)?.id!}
        />
      </div>

      <ol className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="decoration- line-through decoration-red-500"
          >
            {item.name}
          </li>
        ))}
      </ol>
    </div>
  );
}

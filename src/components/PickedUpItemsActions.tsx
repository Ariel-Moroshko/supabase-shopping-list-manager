import { useState } from "react";
import ClearPickedUpItems from "./ClearPickedUpItems";
import UndoPickedUpItem from "./UndoPickedUpItem";
import { Item } from "@/types/List";

type Props = { listId: number; lastPickedUpItemId: number };

export default function PickedUpItemsActions({
  listId,
  lastPickedUpItemId,
}: Props) {
  const [isUndoing, setIsUndoing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  return (
    <div className="flex gap-4 px-2">
      <UndoPickedUpItem
        listId={listId}
        lastPickedUpItemId={lastPickedUpItemId}
        setIsUndoing={setIsUndoing}
        isActive={!isClearing}
      />
      <ClearPickedUpItems
        listId={listId}
        setIsClearing={setIsClearing}
        isActive={!isUndoing}
      />
    </div>
  );
}

import { useState } from "react";
import ClearPickedUpItems from "./ClearPickedUpItems";
import UndoPickedUpItem from "./UndoPickedUpItem";
import { Item } from "@/types/List";
import { Dictionary, Language } from "@/lib/dictionaries";

type Props = {
  listId: number;
  lastPickedUpItemId: number;
  language: Language;
  dictionary: Dictionary["list_page"];
};

export default function PickedUpItemsActions({
  listId,
  lastPickedUpItemId,
  language,
  dictionary,
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
        language={language}
        dictionary={dictionary}
      />
      <ClearPickedUpItems
        listId={listId}
        setIsClearing={setIsClearing}
        isActive={!isUndoing}
        language={language}
        dictionary={dictionary}
      />
    </div>
  );
}

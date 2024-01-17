"use client";

import {
  addItemToShoppingList,
  addItemToShoppingListFormState,
} from "@/actions/addItemToShoppingList";
import { Item } from "@/types/List";
import { useFormState, useFormStatus } from "react-dom";

const initialFormState: addItemToShoppingListFormState = { success: false };
type Props = { listId: number; item: Item };

export default function AllItemsItem({ listId, item }: Props) {
  const [formState, formAction] = useFormState(
    addItemToShoppingList,
    initialFormState,
  );
  return (
    <li className="flex items-center">
      <span
        className={`flex-1 ${item.isPickedUp && "line-through decoration-red-600"}`}
      >
        {item.name}
      </span>
      {item.isInShoppingList ? (
        <div className="bg-emerald-200 px-4">Added!</div>
      ) : (
        <form action={formAction} className="">
          <input type="hidden" name="listId" value={listId} />
          <input type="hidden" name="itemId" value={item.id} />
          <FormContents item={item} formState={formState} />
        </form>
      )}
    </li>
  );
}

function FormContents({
  formState,
  item,
}: {
  formState: addItemToShoppingListFormState;
  item: Item;
}) {
  const { pending } = useFormStatus();
  const hasErrors = !pending && formState.error;
  return (
    <div>
      <button
        type="submit"
        className="bg-slate-300 px-2"
        disabled={item.isInShoppingList}
      >
        {pending || (!pending && formState.success) ? "Adding..." : "Add"}
      </button>
      {hasErrors && (
        <div className="font-bold text-red-600">{formState.error}</div>
      )}
    </div>
  );
}

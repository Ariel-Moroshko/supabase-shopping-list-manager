"use client";

import {
  pickUpItemInShoppingList,
  pickUpItemInShoppingListFormState,
} from "@/actions/pickUpItemInShoppingList";
import { Item } from "@/types/List";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialFormState: pickUpItemInShoppingListFormState = { success: false };
type Props = { listId: number; item: Item };

export default function ShoppingListItem({ listId, item }: Props) {
  const [formState, formAction] = useFormState(
    pickUpItemInShoppingList,
    initialFormState,
  );
  return (
    <li className="flex gap-4">
      <form action={formAction} className="">
        <input type="hidden" name="listId" value={listId} />
        <FormContents item={item} formState={formState} />
      </form>
      <span className="flex-1">{item.name}</span>
    </li>
  );
}

function FormContents({
  formState,
  item,
}: {
  formState: pickUpItemInShoppingListFormState;
  item: Item;
}) {
  const { pending } = useFormStatus();
  const hasErrors = !pending && formState.error;
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!pending && !formState.success) {
      setIsChecked(false);
    }
  }, [formState, pending]);

  return (
    <div>
      <input
        type="checkbox"
        className="h-5 w-5"
        id="itemId"
        name="itemId"
        value={item.id}
        onClick={(e) => e.currentTarget.form?.requestSubmit()}
        disabled={pending || (!pending && formState.success)}
        checked={isChecked}
        onChange={(e) => setIsChecked(e.currentTarget.checked)}
      />
      {hasErrors && (
        <div className="font-bold text-red-600">{formState.error}</div>
      )}
    </div>
  );
}

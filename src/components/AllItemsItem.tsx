"use client";

import {
  addItemToShoppingList,
  addItemToShoppingListFormState,
} from "@/actions/addItemToShoppingList";
import { useListContext } from "@/hooks/useListContext";
import { Item } from "@/types/List";
import { FormEvent, useLayoutEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialFormState: addItemToShoppingListFormState = { success: false };
type Props = { item: Item };

export default function AllItemsItem({ item }: Props) {
  const { list, updateItem } = useListContext();
  const [formState, formAction] = useFormState(
    addItemToShoppingList,
    initialFormState,
  );
  const hasUpdatedList = useRef(false);

  useLayoutEffect(() => {
    if (formState.success && !hasUpdatedList.current) {
      updateItem({
        ...item,
        isInShoppingList: true,
      });
      hasUpdatedList.current = true;
    }
  }, [formState, updateItem, formState.success, item]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    hasUpdatedList.current = false;
  };

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
        <form action={formAction} onSubmit={handleFormSubmit} className="">
          <input type="hidden" name="listId" value={list.id} />
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
  const showErrors = !pending && formState.error;

  return (
    <div>
      <button
        type="submit"
        className="bg-slate-300 px-2"
        disabled={item.isInShoppingList}
      >
        {pending ? "Adding..." : "Add"}
      </button>
      {showErrors && (
        <div className="font-bold text-red-600">{formState.error}</div>
      )}
    </div>
  );
}

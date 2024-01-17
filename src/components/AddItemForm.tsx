"use client";

import { CreateCategoryFormState } from "@/actions/createCategory";
import { createItem } from "@/actions/createItem";
import { List } from "@/types/List";
import { useFormState, useFormStatus } from "react-dom";

const initialFormState: CreateCategoryFormState = {};

type Props = { list: List };

export default function AddItemForm({ list }: Props) {
  const [formState, formAction] = useFormState(createItem, initialFormState);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-8">
      <input type="hidden" name="listId" value={list.id} />
      <FormContents list={list} formState={formState} />
    </form>
  );
}

function FormContents({
  list,
  formState,
}: {
  list: List;
  formState: CreateCategoryFormState;
}) {
  const { pending } = useFormStatus();
  const hasErrors = !pending && formState.error;
  return (
    <>
      <div>
        <label htmlFor="itemName">Item name</label>
        <input
          type="text"
          id="itemName"
          name="itemName"
          className="border border-slate-500"
        />
        {hasErrors && (
          <div className="font-bold text-red-600">{formState.error}</div>
        )}
      </div>
      <div>
        <label htmlFor="categoryId">Category</label>
        <select id="categoryId" name="categoryId">
          {list.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="w-fit border border-slate-800 px-8 py-4">
        {pending ? "Creating item..." : "Create item"}
      </button>
    </>
  );
}

"use client";

import {
  CreateCategoryFormState,
  createCategory,
} from "@/actions/createCategory";
import { useFormState, useFormStatus } from "react-dom";

const initialFormState: CreateCategoryFormState = {};

type Props = { listId: number };

export default function AddCategoryForm({ listId }: Props) {
  const [formState, formAction] = useFormState(
    createCategory,
    initialFormState,
  );

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-8">
      <input type="hidden" name="listId" value={listId} />
      <FormContents formState={formState} />
    </form>
  );
}

function FormContents({ formState }: { formState: CreateCategoryFormState }) {
  const { pending } = useFormStatus();
  const hasErrors = !pending && formState.error;
  return (
    <>
      <div>
        <label htmlFor="categoryName">Category name</label>
        <input
          type="text"
          id="categoryName"
          name="categoryName"
          className="border border-slate-500"
        />
        {hasErrors && (
          <div className="font-bold text-red-600">{formState.error}</div>
        )}
      </div>
      <button type="submit" className="w-fit border border-slate-800 px-8 py-4">
        {pending ? "Creating category..." : "Create category"}
      </button>
    </>
  );
}

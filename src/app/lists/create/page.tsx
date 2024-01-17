"use client";

import { CreateListFormState, createList } from "@/actions/createList";
import { useFormState, useFormStatus } from "react-dom";

const initialFormState: CreateListFormState = {};

export default function CreateList() {
  const [formState, formAction] = useFormState(createList, initialFormState);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-8 px-8">
      <FormContents formState={formState} />
    </form>
  );
}

function FormContents({ formState }: { formState: CreateListFormState }) {
  const { pending } = useFormStatus();
  const hasErrors = !pending && formState.error;
  return (
    <>
      <div>
        <label htmlFor="listName">List name</label>
        <input
          type="text"
          id="listName"
          name="listName"
          className="border border-slate-500"
        />
        {hasErrors && (
          <div className="font-bold text-red-600">{formState.error}</div>
        )}
      </div>
      <button
        type="submit"
        className="max-w-36 border border-slate-800 px-8 py-4"
      >
        {pending ? "Creating list..." : "Create list"}
      </button>
    </>
  );
}

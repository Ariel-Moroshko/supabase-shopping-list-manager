"use client";

import {
  clearPickedUpItems,
  clearPickedUpItemsFormState,
} from "@/actions/clearPickedUpItems";
import { List } from "@/types/List";
import { useFormState, useFormStatus } from "react-dom";

const initialFormState: clearPickedUpItemsFormState = { success: false };

type Props = { listId: number };

export default function ClearPickedUpItemsForm({ listId }: Props) {
  const [formState, formAction] = useFormState(
    clearPickedUpItems,
    initialFormState,
  );

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-8">
      <input type="hidden" name="listId" value={listId} />
      <FormContents formState={formState} />
    </form>
  );
}

function FormContents({
  formState,
}: {
  formState: clearPickedUpItemsFormState;
}) {
  const { pending } = useFormStatus();
  const hasErrors = !pending && formState.error;
  return (
    <>
      <button type="submit" className="w-fit border border-slate-800 px-8 py-4">
        {pending || (!pending && formState.success)
          ? "Clearing items..."
          : "Clear items"}
      </button>
      {hasErrors && (
        <div className="font-bold text-red-600">{formState.error}</div>
      )}
    </>
  );
}

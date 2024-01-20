"use client";

import {
  CancelLastPickupFormState,
  cancelLastPickedUpItem,
} from "@/actions/cancelLastPickedUpItem";
import { Item } from "@/types/List";
import { useFormState, useFormStatus } from "react-dom";

const initialFormState: CancelLastPickupFormState = { success: false };
type Props = { listId: number };

export default function CancelLastPickedUpItem({ listId }: Props) {
  const [formState, formAction] = useFormState(
    cancelLastPickedUpItem,
    initialFormState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="listId" value={listId} />
      <FormContents formState={formState} />
    </form>
  );
}

function FormContents({ formState }: { formState: CancelLastPickupFormState }) {
  const { pending } = useFormStatus();
  const showErrors = !pending && formState.error;

  return (
    <div>
      <button type="submit" className="bg-slate-300 px-2" disabled={pending}>
        {pending ? "Undoing..." : "Undo"}
      </button>
      {showErrors && (
        <div className="font-bold text-red-600">{formState.error}</div>
      )}
    </div>
  );
}

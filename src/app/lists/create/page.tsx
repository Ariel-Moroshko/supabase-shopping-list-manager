"use client";

import { CreateListFormState, createList } from "@/actions/createList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="flex flex-col gap-2">
        <label htmlFor="listName">List name</label>
        <Input type="text" id="listName" name="listName" />
        {hasErrors && (
          <div className="font-bold text-red-600">{formState.error}</div>
        )}
      </div>
      <Button type="submit">
        {pending ? "Creating list..." : "Create list"}
      </Button>
    </>
  );
}

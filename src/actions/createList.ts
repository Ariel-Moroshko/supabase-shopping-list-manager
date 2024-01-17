"use server";

import { createListForUser, isListNameExistsForUser } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import { redirect } from "next/navigation";

export type CreateListFormState = {
  error?: string;
};

export const createList = async (
  prevState: CreateListFormState,
  formData: FormData,
) => {
  const listName = String(formData.get("listName"));
  if (!listName) {
    return {
      error: "List name cant be empty",
    };
  }

  let newListId: number;
  try {
    const userId = await getUserIdFromSession();
    const alreadyHasThisList = await isListNameExistsForUser(userId, listName);
    if (alreadyHasThisList) {
      return {
        error: "This list name already exists. Pick a different name",
      };
    }
    newListId = await createListForUser(userId, listName);
  } catch (error) {
    console.error(error);
    return {
      error: "A db error occured",
    };
  }
  redirect(`/lists/${newListId}`);
};

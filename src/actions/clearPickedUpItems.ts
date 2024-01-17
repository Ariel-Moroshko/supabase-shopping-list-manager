"use server";

import { clearPickedUpItemsInShoppingList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

export type clearPickedUpItemsFormState = {
  success: boolean;
  error?: string;
};

export const clearPickedUpItems = async (
  prevState: clearPickedUpItemsFormState,
  formData: FormData,
) => {
  const listId = Number(formData.get("listId"));

  if (!listId) {
    return {
      success: false,
      error: "Invalid list id",
    };
  }

  try {
    const userId = await getUserIdFromSession();
    await clearPickedUpItemsInShoppingList(userId, listId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

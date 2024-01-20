"use server";

import { cancelLastPickedUpInShoppingList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import { revalidatePath } from "next/cache";

export type CancelLastPickupFormState = {
  success: boolean;
  error?: string;
};

export const cancelLastPickedUpItem = async (
  prevState: CancelLastPickupFormState,
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
    await cancelLastPickedUpInShoppingList(userId, listId);
    revalidatePath(`/lists/${listId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

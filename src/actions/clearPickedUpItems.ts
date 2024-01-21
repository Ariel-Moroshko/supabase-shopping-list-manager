"use server";

import { clearPickedUpItemsInShoppingList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

export const clearPickedUpItems = async (listId: number) => {
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

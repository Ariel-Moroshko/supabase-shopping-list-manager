"use server";

import { undoPickedUpItemInShoppingList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

export const undoPickedUpItem = async (itemId: number) => {
  if (!itemId) {
    return {
      success: false,
      error: "Invalid item id",
    };
  }
  try {
    const userId = await getUserIdFromSession();
    await undoPickedUpItemInShoppingList(userId, itemId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

"use server";

import { pickUpItemInShoppingList as dbPickUpItemInShoppingList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

export type pickUpItemInShoppingListFormState = {
  success: boolean;
  error?: string;
};

export const pickUpItemInShoppingList = async (
  prevState: pickUpItemInShoppingListFormState,
  formData: FormData,
) => {
  const itemId = Number(formData.get("itemId"));
  const listId = Number(formData.get("listId"));

  if (!itemId) {
    return {
      success: false,
      error: "Invalid item id",
    };
  } else if (!listId) {
    return {
      success: false,
      error: "Invalid list id",
    };
  }

  try {
    const userId = await getUserIdFromSession();
    await dbPickUpItemInShoppingList(userId, listId, itemId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

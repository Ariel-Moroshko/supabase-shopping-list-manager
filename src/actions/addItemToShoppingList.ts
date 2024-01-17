"use server";

import { addItemToShoppingList as dbAddItemToShoppingList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

export type addItemToShoppingListFormState = {
  success: boolean;
  error?: string;
};

export const addItemToShoppingList = async (
  prevState: addItemToShoppingListFormState,
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
    await dbAddItemToShoppingList(userId, listId, itemId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

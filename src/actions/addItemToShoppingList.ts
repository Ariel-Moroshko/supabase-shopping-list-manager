"use server";

import { addItemToShoppingList as dbAddItemToShoppingList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export const addItemToShoppingList = async (
  itemId: number,
): Promise<ReturnType> => {
  if (!itemId) {
    return {
      success: false,
      error: "Invalid item id",
    };
  }
  try {
    const userId = await getUserIdFromSession();
    await dbAddItemToShoppingList(userId, itemId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

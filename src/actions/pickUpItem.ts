"use server";

import { pickUpItemInShoppingList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

type ReturnType =
  | {
      success: true;
      pickUpTime: string;
    }
  | { success: false; error: string };

export const pickUpItem = async (itemId: number): Promise<ReturnType> => {
  if (!itemId) {
    return {
      success: false,
      error: "Invalid item id",
    };
  }
  try {
    const userId = await getUserIdFromSession();
    const pickUpTime = new Date().toISOString();
    await pickUpItemInShoppingList(userId, itemId, pickUpTime);
    return { success: true, pickUpTime };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

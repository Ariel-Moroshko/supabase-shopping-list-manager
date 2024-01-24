"use server";

import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import { deleteItem as dbDeleteItem } from "@/lib/db/utils";

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export const deleteItem = async (itemId: number): Promise<ReturnType> => {
  if (!itemId) {
    return {
      success: false,
      error: "Invalid item id",
    };
  }
  try {
    const userId = await getUserIdFromSession();
    await dbDeleteItem(userId, itemId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

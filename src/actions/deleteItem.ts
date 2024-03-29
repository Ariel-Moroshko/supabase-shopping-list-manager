"use server";

import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import { deleteItem as dbDeleteItem } from "@/lib/db/utils";
import { Language, getDictionary, isValidLanguage } from "@/lib/dictionaries";

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export const deleteItem = async (
  lang: Language,
  itemId: number,
): Promise<ReturnType> => {
  if (!itemId) {
    return {
      success: false,
      error: "Invalid item id",
    };
  } else if (!isValidLanguage(lang)) {
    return {
      success: false,
      error: "Invalid lang",
    };
  }
  const { items_page: dictionary } = await getDictionary(lang);
  try {
    const userId = await getUserIdFromSession();
    await dbDeleteItem(userId, itemId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

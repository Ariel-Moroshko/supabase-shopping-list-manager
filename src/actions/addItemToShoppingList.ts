"use server";

import { addItemToShoppingList as dbAddItemToShoppingList } from "@/lib/db/utils";
import { Language, getDictionary, isValidLanguage } from "@/lib/dictionaries";
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
  const { list_page: dictionary } = await getDictionary(lang);

  try {
    const userId = await getUserIdFromSession();
    await dbAddItemToShoppingList(userId, itemId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

"use server";

import { clearPickedUpItemsInShoppingList } from "@/lib/db/utils";
import { Language, getDictionary, isValidLanguage } from "@/lib/dictionaries";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

export const clearPickedUpItems = async (lang: Language, listId: number) => {
  if (!listId) {
    return {
      success: false,
      error: "Invalid list id",
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
    await clearPickedUpItemsInShoppingList(userId, listId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

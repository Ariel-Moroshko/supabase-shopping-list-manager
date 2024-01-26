"use server";

import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import {
  isItemNameExistsInList,
  isUserAllowedToEditItem,
  updateItemName as dbUpdateItemName,
} from "@/lib/db/utils";
import { Language, getDictionary, isValidLanguage } from "@/lib/dictionaries";

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export const updateItemName = async (
  lang: Language,
  itemId: number,
  itemName: string,
): Promise<ReturnType> => {
  const { items_page: dictionary } = await getDictionary(lang);
  if (!isValidLanguage(lang)) {
    return {
      success: false,
      error: "Invalid lang",
    };
  } else if (!itemId) {
    return {
      success: false,
      error: "Invalid item id",
    };
  } else if (!itemName) {
    return {
      success: false,
      error: dictionary.item_name_cant_be_empty,
    };
  }

  try {
    const userId = await getUserIdFromSession();
    const isAllowed = await isUserAllowedToEditItem(userId, itemId);
    if (!isAllowed) {
      return {
        success: false,
        error: dictionary.not_allowed_to_edit_list,
      };
    }
    const nameAlreadyExists = await isItemNameExistsInList(itemId, itemName);
    if (nameAlreadyExists) {
      return {
        success: false,
        error: dictionary.item_already_exists,
      };
    }
    await dbUpdateItemName(itemId, itemName);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

"use server";

import { createItemInCategory, getAllItemsInList } from "@/lib/db/utils";
import { Language, getDictionary, isValidLanguage } from "@/lib/dictionaries";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import { Item } from "@/types/List";

type ReturnType =
  | {
      success: true;
      newItem: Item;
    }
  | {
      success: false;
      error: string;
    };
export const createItem = async (
  lang: Language,
  listId: number,
  categoryId: number,
  itemName: string,
): Promise<ReturnType> => {
  itemName = itemName.trim();
  if (!isValidLanguage(lang)) {
    return {
      success: false,
      error: "Invalid lang",
    };
  }
  const { items_page: dictionary } = await getDictionary(lang);
  if (!itemName) {
    return {
      success: false,
      error: dictionary.item_name_cant_be_empty,
    };
  } else if (!categoryId) {
    return {
      success: false,
      error: "Invalid category id",
    };
  } else if (!listId) {
    return {
      success: false,
      error: "Invalid list id",
    };
  }

  try {
    const userId = await getUserIdFromSession();
    const list = await getAllItemsInList(userId, listId);
    if (!list) {
      return {
        success: false,
        error: dictionary.not_allowed_to_edit_list,
      };
    }
    if (!list.categories.some((category) => category.id === categoryId)) {
      return {
        success: false,
        error: "Unknown category id",
      };
    }
    const itemNameAlreadyExists = list.categories.some((category) => {
      return category.items.some((item) => item.name === itemName);
    });
    if (itemNameAlreadyExists) {
      return {
        success: false,
        error: dictionary.item_already_exists,
      };
    }

    const newItem = await createItemInCategory(categoryId, itemName);
    return { success: true, newItem };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

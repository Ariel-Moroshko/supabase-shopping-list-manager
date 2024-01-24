"use server";

import { createItemInCategory, getAllItemsInList } from "@/lib/db/utils";
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
  listId: number,
  categoryId: number,
  itemName: string,
): Promise<ReturnType> => {
  if (!itemName) {
    return {
      success: false,
      error: "Item name cant be empty",
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
        error: "Not allowed to edit this list",
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
        error: "This item already exists",
      };
    }

    const newItem = await createItemInCategory(categoryId, itemName);
    return { success: true, newItem };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

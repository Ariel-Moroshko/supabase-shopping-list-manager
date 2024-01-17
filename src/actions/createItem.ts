"use server";

import { createItemInCategory, getAllItemsInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import { revalidatePath } from "next/cache";

export type CreateItemFormState = {
  error?: string;
};

export const createItem = async (
  prevState: CreateItemFormState,
  formData: FormData,
) => {
  const itemName = String(formData.get("itemName"));
  const categoryId = Number(formData.get("categoryId"));
  const listId = Number(formData.get("listId"));

  if (!itemName) {
    return {
      error: "Item name cant be empty",
    };
  } else if (!categoryId) {
    return {
      error: "Invalid category id",
    };
  } else if (!listId) {
    return {
      error: "Invalid list id",
    };
  }

  try {
    const userId = await getUserIdFromSession();
    const list = await getAllItemsInList(userId, listId);
    if (!list) {
      return {
        error: "Not allowed to edit this list",
      };
    }
    if (!list.categories.some((category) => category.id === categoryId)) {
      return {
        error: "Unknown category id",
      };
    }
    const itemNameAlreadyExists = list.categories.some((category) => {
      return category.items.some((item) => item.name === itemName);
    });
    if (itemNameAlreadyExists) {
      return {
        error: "This item already exists",
      };
    }

    await createItemInCategory(categoryId, itemName);
    revalidatePath(`/lists/${listId}/items`);
    return {};
  } catch (error) {
    console.error(error);
    return {
      error: "A db error occured",
    };
  }
};

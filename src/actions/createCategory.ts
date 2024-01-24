"use server";

import { createCategoryInList, getAllCategoriesInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import { CategoryWithoutItems } from "@/types/List";

type ReturnType =
  | {
      success: true;
      newCategory: CategoryWithoutItems;
    }
  | {
      success: false;
      error: string;
    };

export const createCategory = async (
  listId: number,
  categoryName: string,
): Promise<ReturnType> => {
  categoryName = categoryName.trim();
  if (!categoryName) {
    return {
      success: false,
      error: "Category name cant be empty",
    };
  } else if (!listId) {
    return {
      success: false,
      error: "Invalid list id",
    };
  }

  try {
    const userId = await getUserIdFromSession();
    const listWithCategories = await getAllCategoriesInList(userId, listId);
    if (!listWithCategories) {
      return {
        success: false,
        error: "Not allowed to edit this list",
      };
    }
    const categoryNameAlreadyExists = listWithCategories.categories.find(
      (category) => category.name === categoryName,
    );
    if (categoryNameAlreadyExists) {
      return {
        success: false,
        error: "This category name already exists",
      };
    }

    const newCategory = await createCategoryInList(listId, categoryName);
    return { success: true, newCategory };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

"use server";

import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import {
  updateCategoryName as dbUpdateCategoryName,
  isCategoryNameExistsInList,
  isUserAllowedToEditCategory,
} from "@/lib/db/utils";

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export const updateCategoryName = async (
  categoryId: number,
  categoryName: string,
): Promise<ReturnType> => {
  if (!categoryId) {
    return {
      success: false,
      error: "Invalid category id",
    };
  } else if (!categoryName) {
    return {
      success: false,
      error: "Invalid category name",
    };
  }
  try {
    const userId = await getUserIdFromSession();
    const isAllowed = await isUserAllowedToEditCategory(userId, categoryId);
    if (!isAllowed) {
      return {
        success: false,
        error: "Not allowed",
      };
    }
    const nameAlreadyExists = await isCategoryNameExistsInList(
      categoryId,
      categoryName,
    );
    if (nameAlreadyExists) {
      return {
        success: false,
        error: "This category name already exists",
      };
    }
    await dbUpdateCategoryName(userId, categoryId, categoryName);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

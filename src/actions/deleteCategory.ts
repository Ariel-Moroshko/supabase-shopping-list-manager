"use server";

import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import {
  updateCategoryName as dbUpdateCategoryName,
  deleteCategoryFromList,
  isCategoryNameExistsInList,
  isUserAllowedToEditCategory,
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

export const deleteCategory = async (
  lang: Language,
  categoryId: number,
): Promise<ReturnType> => {
  if (!Number(categoryId)) {
    return {
      success: false,
      error: "Invalid category id",
    };
  } else if (!isValidLanguage(lang)) {
    return {
      success: false,
      error: "Invalid lang",
    };
  }
  const { categories_page: dictionary } = await getDictionary(lang);

  try {
    const userId = await getUserIdFromSession();
    await deleteCategoryFromList(userId, Number(categoryId));
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

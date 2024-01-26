"use server";

import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import {
  updateCategoryName as dbUpdateCategoryName,
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

export const updateCategoryName = async (
  lang: Language,
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
  } else if (!isValidLanguage(lang)) {
    return {
      success: false,
      error: "Invalid lang",
    };
  }
  const { categories_page: dictionary } = await getDictionary(lang);

  try {
    const userId = await getUserIdFromSession();
    const isAllowed = await isUserAllowedToEditCategory(userId, categoryId);
    if (!isAllowed) {
      return {
        success: false,
        error: dictionary.not_allowed,
      };
    }
    const nameAlreadyExists = await isCategoryNameExistsInList(
      categoryId,
      categoryName,
    );
    if (nameAlreadyExists) {
      return {
        success: false,
        error: dictionary.category_already_exists,
      };
    }
    await dbUpdateCategoryName(userId, categoryId, categoryName);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

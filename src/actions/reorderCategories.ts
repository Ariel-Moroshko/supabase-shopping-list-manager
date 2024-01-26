"use server";

import {
  areAllCategoriesInUsersList,
  reorderCategoriesInList,
} from "@/lib/db/utils";
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

export const reorderCategories = async (
  lang: Language,
  listId: number,
  categoriesIds: number[],
): Promise<ReturnType> => {
  if (!listId) {
    return {
      success: false,
      error: "Invalid List id",
    };
  } else if (!categoriesIds || categoriesIds.length === 0) {
    return {
      success: false,
      error: "Invalid categories id's",
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
    const areValidCategories = await areAllCategoriesInUsersList(
      userId,
      listId,
      categoriesIds,
    );
    if (!areValidCategories) {
      return {
        success: false,
        error: "Invalid categories id's",
      };
    }
    await reorderCategoriesInList(listId, categoriesIds);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

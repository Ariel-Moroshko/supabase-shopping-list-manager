"use server";

import { createCategoryInList, getAllCategoriesInList } from "@/lib/db/utils";
import { Language, getDictionary, isValidLanguage } from "@/lib/dictionaries";
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
  lang: Language,
  listId: number,
  categoryName: string,
): Promise<ReturnType> => {
  categoryName = categoryName.trim();
  if (!isValidLanguage(lang)) {
    return {
      success: false,
      error: "Invalid lang",
    };
  }
  const { categories_page: dictionary } = await getDictionary(lang);
  if (!categoryName) {
    return {
      success: false,
      error: dictionary.category_name_cant_be_empty,
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
        error: dictionary.not_allowed_to_edit_list,
      };
    }
    const categoryNameAlreadyExists = listWithCategories.categories.find(
      (category) => category.name === categoryName,
    );
    if (categoryNameAlreadyExists) {
      return {
        success: false,
        error: dictionary.category_already_exists,
      };
    }

    const newCategory = await createCategoryInList(listId, categoryName);
    return { success: true, newCategory };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

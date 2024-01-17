"use server";

import { createCategoryInList, getAllCategoriesInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import { revalidatePath } from "next/cache";

export type CreateCategoryFormState = {
  error?: string;
};

export const createCategory = async (
  prevState: CreateCategoryFormState,
  formData: FormData,
) => {
  const categoryName = String(formData.get("categoryName"));
  const listId = Number(formData.get("listId"));

  if (!categoryName) {
    return {
      error: "Category name cant be empty",
    };
  } else if (!listId) {
    return {
      error: "Invalid list id",
    };
  }

  try {
    const userId = await getUserIdFromSession();
    const listWithCategories = await getAllCategoriesInList(userId, listId);
    if (!listWithCategories) {
      return {
        error: "Not allowed to edit this list",
      };
    }
    const categoryNameAlreadyExists = listWithCategories.categories.find(
      (category) => category.name === categoryName,
    );
    if (categoryNameAlreadyExists) {
      return {
        error: "This category name already exists",
      };
    }

    await createCategoryInList(listId, categoryName);
    revalidatePath(`/lists/${listId}/categories`);
    return {};
  } catch (error) {
    console.error(error);
    return {
      error: "A db error occured",
    };
  }
};

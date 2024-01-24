"use server";

import {
  areAllCategoriesInUsersList,
  reorderCategoriesInList,
} from "@/lib/db/utils";
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
  }
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
      error: "A db error occured",
    };
  }
};

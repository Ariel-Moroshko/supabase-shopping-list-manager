"use server";

import { getAllCategoriesInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

export const getCategories = async (listId: number) => {
  const userId = await getUserIdFromSession();
  const list = await getAllCategoriesInList(userId, listId);
  if (!list) {
    throw new Error("No list was found");
  }
  return list.categories;
};

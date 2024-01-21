"use server";

import { getAllItemsInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";
import { List } from "@/types/List";

export const getList = async (listId: number) => {
  const userId = await getUserIdFromSession();
  const list = await getAllItemsInList(userId, listId);
  if (!list) {
    throw new Error("No list was found");
  }
  return list;
};

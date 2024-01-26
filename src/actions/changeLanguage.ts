"use server";

import { changeListLanguage } from "@/lib/db/utils";
import { Language } from "@/lib/dictionaries";
import { getUserIdFromSession } from "@/lib/supabase/serverActionClient";

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export const changeLanguage = async (
  listId: number,
  language: Language,
): Promise<ReturnType> => {
  if (!listId) {
    return {
      success: false,
      error: "Invalid list id",
    };
  } else if (!language) {
    return {
      success: false,
      error: "Invalid language",
    };
  }
  try {
    const userId = await getUserIdFromSession();
    await changeListLanguage(userId, listId, language);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "A db error occured",
    };
  }
};

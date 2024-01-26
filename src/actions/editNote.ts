"use server";

import { editItemNote } from "@/lib/db/utils";
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

export const editNote = async (
  lang: Language,
  itemId: number,
  note: string,
): Promise<ReturnType> => {
  if (!itemId) {
    return {
      success: false,
      error: "Invalid item id",
    };
  } else if (!isValidLanguage(lang)) {
    return {
      success: false,
      error: "Invalid lang",
    };
  }
  const { list_page: dictionary } = await getDictionary(lang);

  try {
    const userId = await getUserIdFromSession();
    await editItemNote(userId, itemId, note);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: dictionary.db_error,
    };
  }
};

import { editNote } from "@/actions/editNote";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const useEditNote = (lang: Language) => {
  type MutationType = {
    itemId: number;
    note: string;
  };
  return useMutation({
    mutationFn: async ({ itemId, note }: MutationType) => {
      const result = await editNote(lang, itemId, note);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

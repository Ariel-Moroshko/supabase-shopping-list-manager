import { editNote } from "@/actions/editNote";
import { useMutation } from "@tanstack/react-query";

export const useEditNote = () => {
  type MutationType = {
    itemId: number;
    note: string;
  };
  return useMutation({
    mutationFn: async ({ itemId, note }: MutationType) => {
      const result = await editNote(itemId, note);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
};

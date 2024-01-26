import { pickUpItem } from "@/actions/pickUpItem";
import { Language } from "@/lib/dictionaries";
import { useMutation } from "@tanstack/react-query";

export const usePickUpItem = (lang: Language) => {
  return useMutation({
    mutationFn: async (itemId: number) => {
      const result = await pickUpItem(lang, itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.pickUpTime;
    },
  });
};

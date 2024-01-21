import { pickUpItem } from "@/actions/pickUpItem";
import { useMutation } from "@tanstack/react-query";

export const usePickUpItem = () => {
  return useMutation({
    mutationFn: async (itemId: number) => {
      const result = await pickUpItem(itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.pickUpTime;
    },
  });
};

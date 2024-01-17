import { topNavTitleContext } from "@/components/providers/TopNavTitleContextProvider";
import { useContext } from "react";

export function useTopNavTitleContext() {
  const context = useContext(topNavTitleContext);
  if (!context) {
    throw new Error(
      "useTopNavTitleContext must be used within a TopNavTitleContextProvider",
    );
  }
  return context;
}

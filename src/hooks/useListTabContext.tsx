import { listTabContext } from "@/components/providers/ListTabContextProvider";
import { useContext } from "react";

export function useListTabContext() {
  const context = useContext(listTabContext);
  if (!context) {
    throw new Error(
      "useListTabContext must be used within a ListTabContextProvider",
    );
  }
  return context;
}

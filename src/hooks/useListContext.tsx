import { listContext } from "@/components/providers/ListContextProvider";
import { useContext } from "react";

export function useListContext() {
  const context = useContext(listContext);
  if (!context) {
    throw new Error("useListContext must be used within a ListContextProvider");
  }
  return context;
}

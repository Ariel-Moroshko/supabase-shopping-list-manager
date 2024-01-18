import { listTabContext } from "@/components/providers/TabContextProvider";
import { useContext } from "react";

export function useTabContext() {
  const context = useContext(listTabContext);
  if (!context) {
    throw new Error("useTabContext must be used within a TabContextProvider");
  }
  return context;
}

"use client";

import { ReactNode, createContext, useState } from "react";

type TopNavTitleContext = {
  title: string;
  setTitle: (title: string) => void;
};
export const topNavTitleContext = createContext<TopNavTitleContext | null>(
  null,
);

export default function TopNavTitleContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [title, setTitle] = useState("");

  return (
    <topNavTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </topNavTitleContext.Provider>
  );
}

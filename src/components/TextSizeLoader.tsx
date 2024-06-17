"use client";

import { useLayoutEffect, useState } from "react";
import { sizes } from "./TextSizeChanger";

export function TextSizeLoader({ children }: { children: React.ReactNode }) {
  const [textSizeIndex, setTextSizeIndex] = useState<number | null>(null);
  useLayoutEffect(() => {
    const localStorageTextSizeIndex = +(
      localStorage.getItem("textSizeIndex") ?? "0"
    );
    document.documentElement.style.fontSize = sizes[localStorageTextSizeIndex];
    setTextSizeIndex(localStorageTextSizeIndex);
  }, []);
  if (textSizeIndex === null) {
    return null;
  }

  return children;
}

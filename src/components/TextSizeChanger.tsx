"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export const sizes = ["medium", "large", "x-large"];

export default function TextSizeChanger() {
  const [textSizeIndex, setTextSizeIndex] = useState(
    () => +(localStorage.getItem("textSizeIndex") ?? "0"),
  );

  const updateTextSize = (change: 1 | -1) => {
    const newTextSize = textSizeIndex + change;
    localStorage.setItem("textSizeIndex", String(newTextSize));
    setTextSizeIndex(newTextSize);
    document.documentElement.style.fontSize = sizes[newTextSize];
  };

  const increase = () => {
    updateTextSize(1);
  };

  const decrease = () => {
    updateTextSize(-1);
  };

  return (
    <div className="flex flex-col items-center">
      <p>Text Size</p>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => decrease()}
          disabled={textSizeIndex === 0}
        >
          -
        </Button>
        <p>{sizes[textSizeIndex]}</p>
        <Button
          variant="outline"
          onClick={() => increase()}
          disabled={textSizeIndex === sizes.length - 1}
        >
          +
        </Button>
      </div>
    </div>
  );
}

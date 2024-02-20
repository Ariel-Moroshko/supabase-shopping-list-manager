"use client";

import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div
      className="absolute bottom-0 right-0 top-0 mr-4 flex items-center justify-center p-4"
      onClick={() => handleScrollToTop()}
    >
      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <ArrowUp />
      </button>
    </div>
  );
}

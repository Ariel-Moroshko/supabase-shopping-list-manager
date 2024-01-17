"use client";

import { useTopNavTitleContext } from "@/hooks/useTopNavTitleContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TopNavTitle() {
  const { title, setTitle } = useTopNavTitleContext();
  const pathname = usePathname();
  useEffect(() => {
    setTitle(pathname);
  }, [pathname, setTitle]);
  return title;
}

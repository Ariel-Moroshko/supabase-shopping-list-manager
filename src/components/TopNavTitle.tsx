"use client";

import { useTopNavTitleContext } from "@/hooks/useTopNavTitleContext";
import { Dictionary, Language } from "@/lib/dictionaries";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = { language: Language; dictionary: Dictionary["top_nav"] };

export default function TopNavTitle({ language, dictionary }: Props) {
  const { title, setTitle } = useTopNavTitleContext();
  const pathname = usePathname();
  useEffect(() => {
    const listPageRegex = /^\/(en|he|ru)\/lists\/\d+$/;
    const itemsPageRegex = /^\/(en|he|ru)\/lists\/\d+\/items$/;
    const categoriesPageRegex = /^\/(en|he|ru)\/lists\/\d+\/categories$/;
    const joinListPageRegex = /^\/(en|he|ru)\/lists\/\d+\/join$/;
    const loginPageRegex = /^\/login$/;
    if (listPageRegex.test(pathname)) {
      setTitle(dictionary.all_items);
    } else if (itemsPageRegex.test(pathname)) {
      setTitle(dictionary.items);
    } else if (categoriesPageRegex.test(pathname)) {
      setTitle(dictionary.categories);
    } else if (joinListPageRegex.test(pathname)) {
      setTitle(dictionary.join_list);
    } else if (loginPageRegex.test(pathname)) {
      setTitle("Login");
    } else {
      setTitle("");
    }
  }, [pathname, setTitle, dictionary]);
  return title;
}

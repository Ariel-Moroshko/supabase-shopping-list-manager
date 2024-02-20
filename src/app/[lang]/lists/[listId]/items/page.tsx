import ItemsPage from "@/components/ItemsPage";
import ScrollToTop from "@/components/ScrollToTop";
import { getAllItemsInList } from "@/lib/db/utils";
import { getDictionary, isValidLanguage } from "@/lib/dictionaries";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    lang: string;
    listId: string;
  };
};

export default async function Items({ params: { lang, listId } }: Props) {
  const userId = await getUserIdFromSession();
  if (!Number(listId) || !isValidLanguage(lang)) {
    notFound();
  }
  const list = await getAllItemsInList(userId, Number(listId));
  if (!list) {
    notFound();
  }
  const { items_page } = await getDictionary(lang);

  return (
    <>
      <div className="flex flex-1 flex-col pt-8">
        <Link
          href={`/${lang}/lists/${listId}`}
          className="px-4 font-bold underline"
        >
          {items_page.go_back_to_list}
        </Link>
        <ItemsPage initialList={list} lang={lang} dictionary={items_page} />
      </div>
      <div className="sticky bottom-0 flex min-h-12 items-center justify-center bg-white py-8">
        <ScrollToTop />
      </div>
    </>
  );
}

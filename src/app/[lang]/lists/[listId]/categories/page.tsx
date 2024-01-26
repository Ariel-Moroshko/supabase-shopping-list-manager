import CategoriesPage from "@/components/CategoriesPage";
import { getAllCategoriesInList } from "@/lib/db/utils";
import { Dictionary, getDictionary, isValidLanguage } from "@/lib/dictionaries";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    listId: string;
    lang: string;
  };
};

export default async function Categories({ params: { listId, lang } }: Props) {
  const userId = await getUserIdFromSession();
  if (!Number(listId) || !isValidLanguage(lang)) {
    notFound();
  }
  const list = await getAllCategoriesInList(userId, Number(listId));
  if (!list) {
    notFound();
  }
  const { categories_page } = await getDictionary(lang);
  return (
    <div className="py-8">
      <Link
        href={`/${lang}/lists/${listId}`}
        className="px-4 font-bold underline"
      >
        {categories_page.go_back_to_list}
      </Link>

      <CategoriesPage
        listId={Number(listId)}
        initialCategories={list.categories}
        lang={lang}
        dictionary={categories_page}
      />
    </div>
  );
}

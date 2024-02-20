import List from "@/components/List";
import { BottomNav } from "@/components/BottomNav";
import { getAllItemsInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import { notFound } from "next/navigation";
import TabContextProvider from "@/components/providers/TabContextProvider";
import { headers } from "next/headers";
import { getDictionary, isValidLanguage } from "@/lib/dictionaries";
import ScrollToTop from "@/components/ScrollToTop";
type Props = {
  params: {
    lang: string;
    listId: string;
  };
};

export default async function ListPage({ params: { lang, listId } }: Props) {
  if (!Number(listId) || !isValidLanguage(lang)) {
    notFound();
  }
  const userId = await getUserIdFromSession();
  const list = await getAllItemsInList(userId, Number(listId));
  if (!list) {
    notFound();
  }
  const currentHost = headers().get("host") ?? "unknown";
  const { list_page } = await getDictionary(lang);

  return (
    <TabContextProvider>
      <div className="flex flex-1 flex-col">
        <List
          initialList={list}
          currentHost={currentHost}
          language={lang}
          dictionary={list_page}
        />
      </div>
      <div className="sticky bottom-0 flex min-h-12 items-center justify-center bg-white">
        <BottomNav dictionary={list_page} lang={lang} />
        <ScrollToTop />
      </div>
    </TabContextProvider>
  );
}

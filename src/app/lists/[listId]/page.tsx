import List from "@/components/List";
import { BottomNav } from "@/components/BottomNav";
import { getAllItemsInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import TabContextProvider from "@/components/providers/TabContextProvider";

type Props = {
  params: {
    listId: string;
  };
};

export default async function ListPage({ params: { listId } }: Props) {
  if (!Number(listId)) {
    notFound();
  }
  const userId = await getUserIdFromSession();
  const list = await getAllItemsInList(userId, Number(listId));
  if (!list) {
    notFound();
  }
  if (list?.categories.length === 0) {
    return <NoItemsInList listId={list.id} />;
  }
  return (
    <TabContextProvider>
      <div className="flex-1 px-8 py-4">
        <div className="flex gap-8">
          <Link
            href={`/lists/${list.id}/categories`}
            className="font-bold underline"
          >
            Edit categories
          </Link>
          <Link
            href={`/lists/${list.id}/items`}
            className="font-bold underline"
          >
            Edit items
          </Link>
        </div>
        <List list={list} />
      </div>
      <div className="sticky bottom-0 flex min-h-12 items-center justify-center border-t border-slate-200 bg-white">
        <BottomNav />
      </div>
    </TabContextProvider>
  );
}

function NoItemsInList({ listId }: { listId: number }) {
  return (
    <div className="mt-4">
      No items here.
      <Link
        href={`/lists/${listId}/categories`}
        className="bg-slate-200 px-8 py-4"
      >
        Add categories
      </Link>
    </div>
  );
}

import ItemsPage from "@/components/ItemsPage";
import { getAllItemsInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    listId: string;
  };
};

export default async function Items({ params: { listId } }: Props) {
  const userId = await getUserIdFromSession();
  if (!Number(listId)) {
    notFound();
  }
  const list = await getAllItemsInList(userId, Number(listId));
  if (!list) {
    notFound();
  }

  return (
    <div className="py-8">
      <Link href={`/lists/${listId}`} className="px-4 font-bold underline">
        Go back to list
      </Link>
      <ItemsPage initialList={list} />
    </div>
  );
}

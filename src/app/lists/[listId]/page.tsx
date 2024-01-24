import List from "@/components/List";
import { BottomNav } from "@/components/BottomNav";
import { getAllItemsInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import TabContextProvider from "@/components/providers/TabContextProvider";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";

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

  const currentHost = headers().get("host") ?? "unknown";
  return (
    <TabContextProvider>
      <div className="flex flex-1 flex-col">
        <List initialList={list} currentHost={currentHost} />
      </div>
      <div className="sticky bottom-0 flex min-h-12 items-center justify-center bg-white">
        <BottomNav />
      </div>
    </TabContextProvider>
  );
}

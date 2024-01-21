import AddItemForm from "@/components/AddItemForm";
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
    <div className="px-8 py-8">
      <Link href={`/lists/${listId}`} className="font-bold underline">
        Go back to list
      </Link>
      <AddItemForm list={list} />
      <ol className="flex flex-col gap-4">
        {list?.categories.map((category) => (
          <li key={category.id}>
            <p>{category.name}</p>
            <ol className="flex flex-col gap-2">
              {category.items.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}

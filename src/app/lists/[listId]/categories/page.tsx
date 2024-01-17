import AddCategoryForm from "@/components/AddCategoryForm";
import { getAllCategoriesInList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    listId: string;
  };
};

export default async function Categories({ params: { listId } }: Props) {
  const userId = await getUserIdFromSession();
  if (!Number(listId)) {
    notFound();
  }
  const list = await getAllCategoriesInList(userId, Number(listId));
  if (!list) {
    notFound();
  }

  return (
    <div className="px-8 py-8">
      <Link href={`/lists/${listId}`} className="font-bold underline">
        Go back to list
      </Link>
      <AddCategoryForm listId={list.id} />
      <ol>
        {list?.categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ol>
    </div>
  );
}

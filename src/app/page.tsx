import { getUserMainList } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";

export default async function Home() {
  const userId = await getUserIdFromSession();
  const userWithMainList = await getUserMainList(userId);
  if (!userWithMainList) {
    // token is still valid but no such user exists in the database (maybe I deleted him)
    redirect("/login");
  } else if (!userWithMainList.mainList) {
    redirect(`/en/lists/create`);
  }
  const { id: mainListId, language } = userWithMainList.mainList;
  redirect(`/${language}/lists/${mainListId}`);
}

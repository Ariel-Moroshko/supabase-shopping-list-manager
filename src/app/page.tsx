import { getUserMainListId } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";

export default async function Home() {
  const userId = await getUserIdFromSession();
  let mainListId = null;
  try {
    mainListId = await getUserMainListId(userId);
  } catch (error) {
    // token is still valid but no such user exists in the database (maybe I deleted him)
    redirect("/login");
  }
  if (mainListId !== null) {
    redirect(`/lists/${mainListId}`);
  }
  redirect(`/lists/create`);
}

import SignOut from "@/components/SignOut";
import { getUserMainListId } from "@/lib/db/utils";
import {
  getSupabaseServerClient,
  getUserIdFromSession,
} from "@/lib/supabase/serverClient";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const userId = await getUserIdFromSession();
  let mainListId = null;
  try {
    mainListId = await getUserMainListId(userId);
  } catch (error) {
    // token is still valid but no such user exists in the database (maybe I deleted him)
    // so force the user to log out
    const supabase = getSupabaseServerClient();
    await supabase.auth.signOut();
    redirect("/login");
  }
  if (mainListId !== null) {
    redirect(`/lists/${mainListId}`);
  }
  redirect(`/lists/create`);
}

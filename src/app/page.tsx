import SignOut from "@/components/SignOut";
import { getUserMainListId } from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const userId = await getUserIdFromSession();
  const mainListId = await getUserMainListId(userId);
  if (mainListId !== null) {
    redirect(`/lists/${mainListId}`);
  }
  redirect(`/lists/create`);
  /* <SignOut /> */
}

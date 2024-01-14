"use server";

import { getSupabaseServerActionClient } from "@/lib/supabase/serverActionClient";
import { redirect } from "next/navigation";

export const signOut = async () => {
  const supabase = getSupabaseServerActionClient();
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }

  redirect("/login");
};

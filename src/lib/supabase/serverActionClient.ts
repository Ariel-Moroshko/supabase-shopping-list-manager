import { getSupabaseRouteHandlerClient } from "./routeHandlerClient";

export const getSupabaseServerActionClient = getSupabaseRouteHandlerClient;

export const getUserIdFromSession = async () => {
  const supabase = getSupabaseServerActionClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("Couldn't find user inside current session");
  }
  return session.user.id;
};

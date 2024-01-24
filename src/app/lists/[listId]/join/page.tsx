import {
  getListByIdAndInvitationKey,
  hasUserListId,
  joinUserToList,
} from "@/lib/db/utils";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: {
    listId: string;
  };
  searchParams: {
    invitationKey: string;
  };
};

export default async function JoinList({
  params: { listId },
  searchParams: { invitationKey },
}: Props) {
  if (!Number(listId)) {
    notFound();
  }
  let content = "";
  if (!invitationKey) {
    return (
      <div className="mt-6 flex justify-center">Invalid invitation key</div>
    );
  }
  const list = await getListByIdAndInvitationKey(Number(listId), invitationKey);
  if (!list) {
    return (
      <div className="mt-6 flex justify-center">Invalid invitation key</div>
    );
  }
  const userId = await getUserIdFromSession();
  const userHasThisList = await hasUserListId(userId, Number(listId));
  if (userHasThisList) {
    redirect(`/lists/${listId}`);
  }
  await joinUserToList(userId, Number(listId));
  redirect(`/lists/${listId}`);
}

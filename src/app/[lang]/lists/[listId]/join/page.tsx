import {
  getListByIdAndInvitationKey,
  hasUserListId,
  joinUserToList,
} from "@/lib/db/utils";
import { getDictionary, isValidLanguage } from "@/lib/dictionaries";
import { getUserIdFromSession } from "@/lib/supabase/serverClient";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: {
    lang: string;
    listId: string;
  };
  searchParams: {
    invitationKey: string;
  };
};

export default async function JoinList({
  params: { lang, listId },
  searchParams: { invitationKey },
}: Props) {
  if (!Number(listId) || !isValidLanguage(lang)) {
    notFound();
  }
  const { join_list_page: dictionary } = await getDictionary(lang);
  if (!invitationKey) {
    return (
      <div className="mt-6 flex justify-center">{dictionary.invalid_key}</div>
    );
  }
  const list = await getListByIdAndInvitationKey(Number(listId), invitationKey);
  if (!list) {
    return (
      <div className="mt-6 flex justify-center">{dictionary.invalid_key}</div>
    );
  }
  const userId = await getUserIdFromSession();
  const userHasThisList = await hasUserListId(userId, Number(listId));
  if (userHasThisList) {
    redirect(`/${lang}/lists/${listId}`);
  }
  await joinUserToList(userId, Number(listId));
  redirect(`/${lang}/lists/${listId}`);
}

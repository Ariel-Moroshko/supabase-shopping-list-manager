"use client";

import { signOut } from "@/actions/signOut";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Dictionary } from "@/lib/dictionaries";

type Props = { userEmail: string; dictionary: Dictionary["top_nav"] };

export default function SignOut({ userEmail, dictionary }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div>{userEmail}</div>
      <form action={signOut}>
        <SignOutButton dictionary={dictionary} />
      </form>
    </div>
  );
}

function SignOutButton({ dictionary }: { dictionary: Dictionary["top_nav"] }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="outline"
      className="flex min-w-40 items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          <span>{dictionary.signing_out}...</span>
        </>
      ) : (
        dictionary.signout
      )}
    </Button>
  );
}

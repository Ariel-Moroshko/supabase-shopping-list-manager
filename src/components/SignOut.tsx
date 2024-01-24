"use client";

import { signOut } from "@/actions/signOut";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

type Props = { userEmail: string };

export default function SignOut({ userEmail }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div>{userEmail}</div>
      <form action={signOut}>
        <SignOutButton />
      </form>
    </div>
  );
}

function SignOutButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="outline"
      className="flex min-w-40 items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          <span>Signing out...</span>
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}

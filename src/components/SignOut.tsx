"use client";

import { signOut } from "@/actions/signOut";
import { useFormStatus } from "react-dom";

export default function SignOut() {
  return (
    <form action={signOut}>
      <SignOutButton />
    </form>
  );
}

function SignOutButton() {
  const { pending } = useFormStatus();
  return (
    <button className="bg-red-200 px-8 py-4 w-32">
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}

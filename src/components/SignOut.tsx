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
    <button className="w-32 bg-red-300 px-8 py-4">
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}

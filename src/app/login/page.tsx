"use client";

import SignInWithGoogle from "@/components/SignInWithGoogle";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") ?? "/";
  return (
    <div>
      <h1>Login page</h1>
      <SignInWithGoogle redirectedFrom={redirectedFrom} />
    </div>
  );
}

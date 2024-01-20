"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = { host: string };

export default function SignInWithGoogle({ host }: Props) {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");
  const [isPending, setIsPending] = useState(false);
  const handleSignInWithGoogle = () => {
    setIsPending(true);
    const login = async () => {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_VERCEL_ENV !== "development"
              ? `https://${host}/auth/callback?next=${redirectedFrom}`
              : `http://${host}/auth/callback?next=${redirectedFrom}`,
        },
      });
    };
    login();
  };

  return (
    <button onClick={handleSignInWithGoogle} className="bg-blue-300 px-8 py-4">
      {isPending ? "Signing in..." : "Sign in with Google"}
    </button>
  );
}

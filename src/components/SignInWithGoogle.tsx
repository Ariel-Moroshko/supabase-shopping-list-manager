"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { useState } from "react";

export default function SignInWithGoogle() {
  const [isPending, setIsPending] = useState(false);
  const handleSignInWithGoogle = () => {
    setIsPending(true);
    const login = async () => {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_URL
            ? `https://${process.env.NEXT_PUBLIC_URL}/auth/callback`
            : `http://localhost:3000/auth/callback`,
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

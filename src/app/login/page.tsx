import SignInWithGoogle from "@/components/SignInWithGoogle";
import { headers } from "next/headers";

export default function Login() {
  const host = headers().get("host")!;
  return (
    <div>
      <h1>Login page</h1>
      <SignInWithGoogle host={host} />
    </div>
  );
}

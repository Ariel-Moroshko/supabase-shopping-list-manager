import SignInWithGoogle from "@/components/SignInWithGoogle";
import { headers } from "next/headers";

export default async function Login() {
  const host = headers().get("host")!;
  return (
    <div className="mt-8 flex justify-center">
      <SignInWithGoogle host={host} />
    </div>
  );
}

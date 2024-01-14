import SignOut from "@/components/SignOut";

export default async function Home() {
  return (
    <div>
      Homepage - hello from protected page
      <SignOut />
    </div>
  );
}

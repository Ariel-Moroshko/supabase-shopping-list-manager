import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <h2>Could not find list</h2>
      <Link href="/" className="bg-slate-100 px-4 py-2">
        Return Home
      </Link>
    </div>
  );
}

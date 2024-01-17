import TopNavTitle from "./TopNavTitle";

export default function TopNav() {
  return (
    <nav className="sticky top-0 flex min-h-12 w-full items-center bg-blue-600 text-slate-50">
      <div className="min-w-0 basis-0 px-8">☰</div>
      <div className="flex-1 text-center">
        <TopNavTitle />
      </div>
      <div className="min-w-0 basis-0 px-8"></div>
    </nav>
  );
}

import { Menu } from "lucide-react";
import TopNavTitle from "./TopNavTitle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SignOut from "./SignOut";
import { getUserEmailFromSession } from "@/lib/supabase/serverClient";

export default async function TopNav() {
  const userEmail = await getUserEmailFromSession();
  return (
    <nav className="sticky top-0 z-[49] flex min-h-12 w-full items-center bg-blue-600 text-slate-50">
      <div className="flex min-w-0 basis-0 items-center justify-center px-8">
        {userEmail && (
          <Sheet>
            <SheetTrigger>
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent side="left">
              <div>
                <SignOut userEmail={userEmail} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      <div className="flex-1 text-center">
        <TopNavTitle />
      </div>
      <div className="min-w-0 basis-0 px-8"></div>
    </nav>
  );
}

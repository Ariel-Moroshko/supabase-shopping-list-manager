import { Menu } from "lucide-react";
import TopNavTitle from "./TopNavTitle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SignOut from "./SignOut";
import { getUserEmailFromSession } from "@/lib/supabase/serverClient";
import { Language, getDictionary } from "@/lib/dictionaries";

type Props = { language: Language };

export default async function TopNav({ language }: Props) {
  const userEmail = await getUserEmailFromSession();
  const { top_nav } = await getDictionary(language);
  return (
    <nav className="sticky top-0 z-[49] flex min-h-12 w-full items-center bg-blue-600 text-slate-50">
      <div className="flex min-w-0 basis-0 items-center justify-center px-8">
        {userEmail && (
          <Sheet>
            <SheetTrigger>
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent
              side={language === "he" ? "right" : "left"}
              className="flex flex-col"
            >
              <div>
                <SignOut userEmail={userEmail} dictionary={top_nav} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      <div className="flex-1 text-center">
        <TopNavTitle language={language} dictionary={top_nav} />
      </div>
      <div className="min-w-0 basis-0 px-8"></div>
    </nav>
  );
}

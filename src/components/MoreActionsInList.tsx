import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dictionary, Language } from "@/lib/dictionaries";
import { List } from "@/types/List";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  list: List;
  currentHost: string;
  dictionary: Dictionary["list_page"];
  language: Language;
  onLanguageChange: (lang: Language) => void;
};

export default function MoreActionsInList({
  list,
  currentHost,
  dictionary,
  language,
  onLanguageChange,
}: Props) {
  const [protocol, setProtocol] = useState("");

  useEffect(() => {
    setProtocol(location.protocol);
  }, []);

  return (
    <Dialog>
      <DropdownMenu dir={language === "he" ? "rtl" : "ltr"}>
        <DropdownMenuTrigger className="" asChild>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Settings size={18} />
            <span>{dictionary.more}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/${language}/lists/${list.id}/categories`}>
              {dictionary.edit_categories}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${language}/lists/${list.id}/items`}>
              {dictionary.edit_items}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>{dictionary.share_list}</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger dir={language === "he" ? "rtl" : "ltr"}>
              <span>{dictionary.change_language}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => onLanguageChange("en")}>
                  <span>{dictionary.english}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLanguageChange("he")}>
                  <span>{dictionary.hebrew}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLanguageChange("ru")}>
                  <span>{dictionary.russian}</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            {dictionary.share_list}
          </DialogTitle>
          <div className="text-center">{dictionary.share_list_description}</div>
          <div className="flex flex-col gap-4 text-center">
            <div className="mt-2 border-2 border-dashed bg-blue-50 px-4 py-2">
              {`${protocol}//${currentHost}/${language}/lists/${list.id}/join?invitationKey=${list.invitationKey}`}
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative">
                <span className="bg-white px-2">
                  {dictionary.share_list_or}
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  window.open(
                    `whatsapp://send?text=To join my shopping list click the following link:%0Ahttps://${currentHost}/${language}/lists/${list.id}/join?invitationKey=${list.invitationKey}`,
                  );
                }}
                variant="secondary"
                className="flex flex-1 items-center gap-2 bg-[#d8f7e3]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#25d366"
                  stroke="#25d366"
                  viewBox="0 0 308 308"
                >
                  <g>
                    <g>
                      <path d="M227.904 176.981c-.6-.288-23.054-11.345-27.044-12.781-1.629-.585-3.374-1.156-5.23-1.156-3.032 0-5.579 1.511-7.563 4.479-2.243 3.334-9.033 11.271-11.131 13.642-.274.313-.648.687-.872.687-.201 0-3.676-1.431-4.728-1.888-24.087-10.463-42.37-35.624-44.877-39.867-.358-.61-.373-.887-.376-.887.088-.323.898-1.135 1.316-1.554 1.223-1.21 2.548-2.805 3.83-4.348a140.77 140.77 0 011.812-2.153c1.86-2.164 2.688-3.844 3.648-5.79l.503-1.011c2.344-4.657.342-8.587-.305-9.856-.531-1.062-10.012-23.944-11.02-26.348-2.424-5.801-5.627-8.502-10.078-8.502-.413 0 0 0-1.732.073-2.109.089-13.594 1.601-18.672 4.802C90 87.918 80.89 98.74 80.89 117.772c0 17.129 10.87 33.302 15.537 39.453.116.155.329.47.638.922 17.873 26.102 40.154 45.446 62.741 54.469 21.745 8.686 32.042 9.69 37.896 9.69h.001c2.46 0 4.429-.193 6.166-.364l1.102-.105c7.512-.666 24.02-9.22 27.775-19.655 2.958-8.219 3.738-17.199 1.77-20.458-1.348-2.216-3.671-3.331-6.612-4.743z"></path>
                      <path d="M156.734 0C73.318 0 5.454 67.354 5.454 150.143c0 26.777 7.166 52.988 20.741 75.928L.212 302.716a3.998 3.998 0 004.999 5.096l79.92-25.396c21.87 11.685 46.588 17.853 71.604 17.853C240.143 300.27 308 232.923 308 150.143 308 67.354 240.143 0 156.734 0zm0 268.994c-23.539 0-46.338-6.797-65.936-19.657a3.996 3.996 0 00-3.406-.467l-40.035 12.726 12.924-38.129a4.002 4.002 0 00-.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 0-65.543 53.754-118.867 119.826-118.867 66.064 0 119.812 53.324 119.812 118.867.001 65.535-53.746 118.851-119.811 118.851z"></path>
                    </g>
                  </g>
                </svg>
                <span>{dictionary.share_with_whatsapp}</span>
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

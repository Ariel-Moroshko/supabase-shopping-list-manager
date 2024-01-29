import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dictionary } from "@/lib/dictionaries";

type Props = {
  searchText: string;
  setSearchText: (t: string) => void;
  dictionary: Dictionary["list_page"];
};

export default function SearchItem({
  searchText,
  setSearchText,
  dictionary,
}: Props) {
  return (
    <div className="relative flex-1">
      <Input
        type="text"
        id="searchText"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="bg-slate-100 pe-8"
        placeholder={dictionary.search_item}
      />
      <Button
        variant="ghost"
        className="absolute top-1/2 -translate-y-1/2 px-2 py-2 hover:bg-inherit ltr:right-0 rtl:left-0"
      >
        <X onClick={() => setSearchText("")} strokeWidth={1} size={16} />
      </Button>
    </div>
  );
}

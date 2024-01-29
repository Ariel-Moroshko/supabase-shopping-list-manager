import { List } from "@/types/List";
import AllItemsCategory from "./AllItemsCategory";
import { Accordion } from "./ui/accordion";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dictionary, Language } from "@/lib/dictionaries";
import { changeLanguage } from "@/actions/changeLanguage";
import MoreActionsInList from "./MoreActionsInList";
import SearchItem from "./SearchItem";

type Props = {
  list: List;
  currentHost: string;
  dictionary: Dictionary["list_page"];
  language: Language;
};

export default function AllItemsList({
  list,
  currentHost,
  dictionary,
  language,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const filteredList: List = {
    ...list,
    categories: list.categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()),
        ),
      }))
      .filter((category) => category.items.length > 0),
  };

  const handleLanguageChange = async (updatedLang: Language) => {
    await changeLanguage(list.id, updatedLang);
    window.location.href = `/${updatedLang}/lists/${list.id}`;
  };

  let content;

  if (list.categories.length === 0) {
    content = (
      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <div>{dictionary.list_is_empty}</div>
        <Link href={`/${language}/lists/${list.id}/categories`}>
          <Button className="min-w-64">{dictionary.add_categories}</Button>
        </Link>
      </div>
    );
  } else if (searchText) {
    if (filteredList.categories.length > 0) {
      content = (
        <Accordion
          type="multiple"
          defaultValue={list.categories.map((c) => c.id.toString())}
          className="px-4"
        >
          {filteredList.categories.map((category) => (
            <AllItemsCategory
              key={category.id}
              listId={list.id}
              category={category}
              language={language}
              dictionary={dictionary}
            />
          ))}
        </Accordion>
      );
    } else {
      content = (
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <div>{dictionary.no_search_results}</div>
          <div>
            <Button variant="outline" onClick={() => setSearchText("")}>
              {dictionary.clear_search}
            </Button>
          </div>
        </div>
      );
    }
  } else {
    content = (
      <Accordion
        type="multiple"
        defaultValue={list.categories.map((c) => c.id.toString())}
        className="px-4"
      >
        {list.categories.map((category) => (
          <AllItemsCategory
            key={category.id}
            listId={list.id}
            category={category}
            language={language}
            dictionary={dictionary}
          />
        ))}
      </Accordion>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="mt-4 flex gap-2 px-4">
        <SearchItem
          searchText={searchText}
          setSearchText={setSearchText}
          dictionary={dictionary}
        />

        <MoreActionsInList
          list={list}
          currentHost={currentHost}
          language={language}
          dictionary={dictionary}
          onLanguageChange={handleLanguageChange}
        />
      </div>
      {content}
    </div>
  );
}

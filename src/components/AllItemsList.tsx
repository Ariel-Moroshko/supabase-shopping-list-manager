import AllItemsCategory from "./AllItemsCategory";
import { useListContext } from "@/hooks/useListContext";

export default function AllItemsList() {
  const { list } = useListContext();
  return (
    <ol className="flex flex-1 flex-col gap-4 divide-y">
      {list.categories.map((category) => (
        <AllItemsCategory key={category.id} category={category} />
      ))}
    </ol>
  );
}

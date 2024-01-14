import RealTimeTodos from "./RealTimeTodos";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

export type TodoType = {
  id: number;
  name: string;
};

export default async function LiveViews() {
  const supabase = getSupabaseServerClient();
  const { data: todos, error } = await supabase.from("todos").select();
  console.log("todos is", todos);
  console.log("error:", error);
  return (
    <main>
      <RealTimeTodos todos={todos as TodoType[]} />
    </main>
  );
}

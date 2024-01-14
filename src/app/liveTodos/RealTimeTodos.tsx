"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import Todo from "./Todo";
import { TodoType } from "./page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RealTimeTodos({ todos }: { todos: TodoType[] }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  useEffect(() => {
    const channel = supabase
      .channel("my realtime todos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        () => {
          // function to invlidate the data
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);
  return todos?.map((todo) => <Todo key={todo.id} todo={todo} />);
}

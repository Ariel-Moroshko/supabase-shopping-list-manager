import { TodoType } from "./page";

export default function Todo({ todo }: { todo: TodoType }) {
  {
    return <div>{todo.name}</div>;
  }
}

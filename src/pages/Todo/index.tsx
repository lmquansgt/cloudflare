import { AddTodo, Item } from "../../components";

type Todo = {
  id: string;
  title: string;
};

type TodoProps = Todo[];

export const Todo = (todos: TodoProps) => (
  <div id="wrapper">
    <AddTodo />
    {todos.map((todo) => (
      <Item title={todo.title} id={todo.id} />
    ))}
  </div>
);

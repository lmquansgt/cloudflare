import { AddTodo, Item } from "../../components"

type Todo = {
	id: string,
	title: string
}

type TodoProps = Todo[]

export const Todo = (todos: TodoProps) => (
	<div>
		<AddTodo />
		{todos.map((todo) => <Item key={todo.id} title={todo.title} id={todo.id} />)}
		<div id="todo"></div>
	</div>
)

import { Context } from "hono";
import { Todo } from "../pages/Todo";
import { Bindings, Env } from "hono/types";

type AppContext = {
  Bindings: Bindings
}

type CreateTodoValidationSchema = {
    in: {
      form: {
        title: string;
      }
    }
    out: {
        form: {
          title: string
        }
    }
  }

const getTodo = async (c: Context<AppContext & Env, "/todo", CreateTodoValidationSchema>) => {
  const { keys } = await c.env.DB.list()
  const todos = await Promise.all(keys.map(async (key: KVNamespaceListKey<null, string>) => {
    let title = await c.env.DB.get(key?.name)
    if (!title) {
      title = 'DB error'
    }
    return { id: key.name, title }
  }));

  return c.render(Todo(todos))
}

const createTodo = async (c: Context) => {
    const { title } = c.req.valid('form')
    const id = crypto.randomUUID()
    await c.env.DB.put(id, title)
    return c.html(<Item title={title} id={id} />)
  }

export { getTodo, createTodo }

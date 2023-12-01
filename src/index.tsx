import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { renderer, AddTodo, Item } from './components'

type Bindings = {
  DB: KVNamespace
}

type Todo = {
  title: string
  id: string
}

type Result = {
  keys: Todo[],
  list_complete: boolean,
  cursor: "6Ck1la0VxJ0djhidm1MdX2FyD"
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('*', renderer)

app.get('/', async (c) => {
  const data: Result = await c.env.DB.list()
  console.log(data)
  const todos = data.keys
  return c.render(
    <div>
      <AddTodo />
      {todos.map((todo) => {
        return <Item title={todo.title} id={todo.id} />
      })}
      <div id="todo"></div>
    </div>
  )
})

app.post( '/todo', zValidator( 'form', z.object({ title: z.string().min(1) })),
  async (c) => {
    const { title } = c.req.valid('form')
    const id = crypto.randomUUID()
    await c.env.DB.put(id, title)
    return c.html(<Item title={title} id={id} />)
  }
)

app.delete('/todo/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.delete(id)
  c.status(200)
  return c.body(null)
})

export default app

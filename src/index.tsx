import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { renderer, AddTodo, Item } from './components'
import { getTodo } from './controllers/TodoController'

type Bindings = {
  DB: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('*', renderer)

app.get('/', getTodo)

app.post( 
  '/todo',
  zValidator( 'form', z.object({ title: z.string().min(1) })),
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

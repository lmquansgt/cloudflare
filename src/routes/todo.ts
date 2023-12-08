import { AddError, AddTodoResponse, Item, renderer } from '../components'
import app from '../core/app'
import { Todo } from '../pages/Todo'
import { z } from 'zod'
import { validator } from 'hono/validator'

app.get('*', renderer)

app.get('/', async (c) => {
  const { keys } = await c.env.DB.list()
  const todos = await Promise.all(keys.map(async (key) => {
    let title = await c.env.DB.get(key.name)
    if (!title) {
      title = 'DB error'
    }
    return { id: key.name, title }
  }));
  return c.render(Todo(todos));
})

const createSchema = z.object({
	title: z.string().min(1) 
})

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === "string") {
      return { message: "bad type!" };
    }
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: `less-than-${(issue.params || {}).minimum}` };
  }
  return { message: ctx.defaultError };
};

app.post( 
  '/todo',
  validator('form', (value, c) => {
		console.log(value)
    const parsed = createSchema.safeParse(value)
    if (!parsed.success) {
      return c.html(AddError({value: value.title, errors: parsed.error.issues}))
    }
    return parsed.data
  }),
  async (c) => {
    const { title } = c.req.valid('form')
    const id = crypto.randomUUID()
    await c.env.DB.put(id, title)
    return c.render(AddTodoResponse({title, id}));
  }
)

app.delete('/todo/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.delete(id)
  c.status(200)
  return c.body(null)
})


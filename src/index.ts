import { Hono } from 'hono'
import test from './routes/test'
import todos from './routes/todo'

const app = new Hono()

app.route('/todos', todos)
app.route('/test', test)

export default app 

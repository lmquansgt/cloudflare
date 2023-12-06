import { renderer } from '../components'
import { createTodo } from '../controllers/TodoController'
import app from '../index'

app.get('*', renderer)

app.get('/', createTodo)

export default app

import app from './core/app'
import { renderer } from './components'

app.get('*', renderer)
import './routes/todo'
import './routes/test'

export default app

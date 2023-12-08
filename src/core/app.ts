import { Hono } from 'hono'
import { renderer } from '../components'

type Bindings = {
  DB: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()
app.get('*', renderer)

export default app 


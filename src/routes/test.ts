import app from "../core/app"

app.get('/test', async (c) => {
  return c.text('Test')
})

import { html } from 'hono/html'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Fragment } from 'hono/jsx/jsx-runtime'

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="htmx-config" content='{"useTemplateFragments":"true"}'>
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Hono + htmx</title>
      </head>
      <body>
        <div class="p-4">
          <h1 class="text-4xl font-bold mb-4"><a href="/">Todo</a></h1>
          ${children}
        </div>
      </body>
    </html>
  `
})

export const AddTodo = () => (
  <form id="form" hx-post="/todo" hx-target="this" hx-swap="outerHTML" _="on htmx:afterRequest reset() me" class="mb-4" >
    <div class="mb-2">
      <input name="title" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5" />
    </div>
    <button class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center" type="submit">
      Submit
    </button>
  </form>
)

export const AddError = ({value, errors}) => (
  <form id="form" hx-post="/todo" hx-target="this" hx-swap="outerHTML" _="on htmx:afterRequest reset() me" class="mb-4" >
    <div class="mb-2">
      <input name="title" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5" value={value}/>
    </div>
    {errors.map((error) => <div class="text-red-600" key={error.code}>{error.message}</div>)}
    <button class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center" type="submit">
      Submit
    </button>
  </form>
)

export const Item = ({ title, id }: { title: string; id: string }) => (
  <p class="flex row items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2">
    {title}
    <button
      hx-target="closest p"
      hx-swap="outerHTML"
      hx-delete={`/todo/${id}`}
      class="font-medium"
    >
      Delete
    </button>
  </p>
)

export const AddTodoResponse = ({ title, id }: { title: string; id: string }) => (
  <>
    <div hx-swap-oob="beforebegin:#todo">
      <Item title={title} id={id} />
    </div>
    <AddTodo />
  </>
)

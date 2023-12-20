import { html } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="htmx-config" content='{"useTemplateFragments":"true"}' />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Hono + htmx</title>
      </head>
      <body>
        <div class="p-4">
          <h1
            hx-get="/todos/api/todo/count"
            hx-swap="outerHTML"
            hx-trigger="load, UpdateTodo from:body"
            class="text-4xl font-bold mb-4"
          >
            Todo count:
          </h1>
          ${children}
        </div>
      </body>
    </html>
  `;
});

export const TodoCount = (amount: number) => (
  <h1
    hx-get="/todos/api/todo/count"
    hx-swap="outerHTML"
    hx-trigger="UpdateTodo from:body"
    class="text-4xl font-bold mb-4"
  >
    {`Todo count: ${amount}`}
  </h1>
);

type AddTodoProps = {
  value?: string;
  errors?: AddTodoError[];
};

type AddTodoError = {
  code: string;
  message: string;
};

export const AddTodo = ({ value, errors }: AddTodoProps) => (
  <form
    id="form"
    hx-post="/todos/create"
    hx-swap="outerHTML"
    _="on htmx:afterRequest reset() me"
    class="mb-4"
  >
    <div class="mb-2">
      <input
        name="title"
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
        value={value ? value : ""}
      />
    </div>
    {errors &&
      errors.map((error: AddTodoError) => (
        <div class="text-red-600" key={error.code}>
          {error.message}
        </div>
      ))}
    <button
      class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center"
      type="submit"
    >
      Submit
    </button>
  </form>
);

export const Item = ({ title, id }: { title: string; id: string }) => (
  <p class="flex row items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2">
    <a href={`/todos/update/${id}`}>{title}</a>
    <button
      hx-delete={`todos/delete/${id}`}
      hx-target="closest p"
      hx-swap="delete"
      class="font-medium"
    >
      Delete
    </button>
  </p>
);

export const AddTodoResponse = ({
  title,
  id,
}: {
  title: string;
  id: string;
}) => (
  <>
    <div hx-swap-oob="beforeend:#wrapper">
      <Item title={title} id={id} />
    </div>
    <AddTodo />
  </>
);

export const UpdateTodo = ({ id, title }: { id: string; title: string }) => (
  <form id="form" hx-put={`${id}`}>
    <div class="flex flex-col py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2">
      <div class="flex gap-6">
        <h6>Title:</h6>
        <input class="bg-gray-100 text-gray-600" name="title" value={title} />
      </div>
      <div class="flex gap-6">
        <h6>Id:</h6>
        <div>{id}</div>
      </div>
    </div>
    <div>
      <button class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center">
        Update
      </button>
    </div>
  </form>
);

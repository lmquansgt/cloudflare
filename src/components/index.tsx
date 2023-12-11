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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js"
          integrity="sha384-NaWTHo/8YCBYJ59830LTz/P4aQZK1sS0SneOgAvhsIl3zBu8r9RevNg5lHCHAuQ/"
          crossorigin="anonymous"
        ></script>
        <title>Hono + htmx</title>
      </head>
      <body>
        <div class="p-4">
          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center"
            onclick="exportPdf()"
          >
            Export PDF
          </button>
          <script>
            function exportPdf(e) {
              const doc = new jsPDF("p", "pt", "a4");

              doc.html(document.body, {
                callback: function (doc) {
                  doc.save();
                },
                x: 0,
                y: 0,
                width: 100,
                windowWidth: 100,
              });
            }
          </script>
          <h1
            hx-get="/todos/api/todo/count"
            hx-swap="outerHTML"
            hx-trigger="load, updateTodo from:body"
            class="text-4xl font-bold mb-4"
          >
            Todo
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
    hx-trigger="updateTodo from:body"
    class="text-4xl font-bold mb-4"
  >
    {`Todo: ${amount}`}
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
    hx-target="this"
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
    {title}
    <button
      hx-target="closest p"
      hx-swap="outerHTML"
      hx-delete={`todos/delete/${id}`}
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
    <div hx-swap-oob="beforebegin:#todo">
      <Item title={title} id={id} />
    </div>
    <AddTodo />
  </>
);

export const Nav = () => (
  <>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="htmx-config" content='{"useTemplateFragments":"true"}' />
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Hono + htmx</title>
    </head>
    <body class="flex justify-center items-center">
      <div class="flex flex-col min-h-[50vh] w-[50vw] gap-6">
        <a
          class="flex-auto flex justify-center items-center border-2 border-green-600 text-8xl text-green-600"
          href="/todos"
        >
          Todos
        </a>
        <a
          class="flex-auto flex justify-center items-center border-2 border-indigo-600 text-8xl text-indigo-600"
          href="/test"
        >
          Test
        </a>
      </div>
    </body>
  </>
);

import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { AddTodo, AddTodoResponse, TodoCount, renderer } from "../components";
import { Todo } from "../pages/Todo";

type Bindings = {
  DB: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("*", renderer);

app.get("/", async (c) => {
  const { keys } = await c.env.DB.list();
  const todos = await Promise.all(
    keys.map(async (key) => {
      let title = await c.env.DB.get(key.name);
      if (!title) {
        title = "DB error";
      }
      return { id: key.name, title };
    }),
  );

  return c.render(Todo(todos));
});

app.get("/api/todo/count", async (c) => {
  const { keys } = await c.env.DB.list();
  return c.html(TodoCount(keys.length));
});

const createTodoSchema = z.object({
  title: z.string().min(1),
});

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === "string") {
      return { message: "bad type!" };
    }
  }
  if (issue.code === "too_small") {
    return {
      message: `Todo's title must be longer than ${issue.minimum} characters`,
    };
  }
  return { message: ctx.defaultError };
};

app.post(
  "/create",
  validator("form", (value, c) => {
    const results = createTodoSchema.safeParse(value, {
      errorMap: customErrorMap,
    });
    if (!results.success) {
      return c.html(
        AddTodo({ value: value.title as string, errors: results.error.issues }),
      );
    }
    return results.data;
  }),
  async (c) => {
    const { title } = c.req.valid("form");
    const id = crypto.randomUUID();
    await c.env.DB.put(id, title);
    c.header("HX-Trigger", "updateTodo");
    return c.render(AddTodoResponse({ title, id }));
  },
);

app.delete("/delete/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.delete(id);
  c.header("HX-Trigger", "updateTodo");
  c.status(200);
  return c.body(null);
});

export default app;

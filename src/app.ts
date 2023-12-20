import { Hono } from "hono";
import { renderer } from "./components";
import home from "./routes/index";
import test from "./routes/test";
import todos from "./routes/todo";

const app = new Hono();

app.get("*", renderer);
app.route("/", home);
app.route("/todos", todos);
app.route("/test", test);

export default app;

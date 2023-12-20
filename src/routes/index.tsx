import { Hono } from "hono";
import { Nav } from "../pages";

const app = new Hono();

app.get("/", async (c) => {
  return c.html(<Nav />);
});

export default app;

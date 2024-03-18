import { Hono } from "https://deno.land/x/hono@v3.11.7/mod.ts";
import { cors } from "https://deno.land/x/hono/middleware.ts";
import { getSuggestion } from "./services/getSuggestion.js";

const app = new Hono();

app.use("/api/*", cors());

app.post("/api/completion", async (c) => {
  const { text } = await c.req.json()
  console.log(text);

  const suggestedSentence = await getSuggestion(text);

  return c.json({
    "predictions": [
      {
        "text": suggestedSentence,
      }
    ]
  });
});

Deno.serve(app.fetch);

import { ZodError } from "zod";

export function serializeZodErrorNested(error: ZodError) {
  const out: Record<"body" | "params" | "query", Record<string, string>> = {
    body: {},
    params: {},
    query: {},
  };

  for (const e of error.errors) {
    const [segment, ...rest] = e.path;
    const key = rest.join(".");
    if (segment && out[segment as keyof typeof out]) {
      out[segment as keyof typeof out][key] = e.message;
    }
  }

  return out;
}

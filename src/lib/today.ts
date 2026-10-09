import { connection } from "next/server";
import { toIsoDate } from "./date";

// Today's date as YYYY-MM-DD in Swedish time, for Server Components.
// `connection()` tells Next this value belongs to the request, not the
// build (Cache Components refuses `new Date()` during prerender).
export async function todayIso(): Promise<string> {
  await connection();
  return toIsoDate(new Date());
}

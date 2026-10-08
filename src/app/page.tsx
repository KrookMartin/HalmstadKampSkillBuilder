import { redirect } from "next/navigation";

// Root redirects to the member start page.
// The member layout will redirect unauthenticated users to /login.
export default function RootPage() {
  redirect("/idag");
}

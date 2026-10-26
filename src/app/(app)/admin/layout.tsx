import { requireRole } from "@/lib/auth";

// Every page under /admin is admin-only. Guarding here means a new page
// can't accidentally be left open (same pattern as /traning).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["admin"]);
  return children;
}

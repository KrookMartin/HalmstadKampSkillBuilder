import { requireRole } from "@/lib/auth";

// Every page under /traning is coach-only. Guarding here means a new page
// can't accidentally be left open to members.
export default async function TraningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["coach", "admin"]);
  return <>{children}</>;
}

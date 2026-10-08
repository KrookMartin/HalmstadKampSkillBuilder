import { requireRole } from "@/lib/auth";

// Coach and admin pages pass through here.
export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["coach", "admin"]);
  return <>{children}</>;
}

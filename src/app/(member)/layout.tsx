import { requireActiveProfile } from "@/lib/auth";

// Every member page passes through here.
// requireActiveProfile redirects to /login if the session is missing or pending.
export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireActiveProfile();
  return <>{children}</>;
}

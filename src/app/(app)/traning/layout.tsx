import { requireRole } from "@/lib/auth";
import { signOut } from "@/features/auth/actions";
import { buttonSecondary } from "@/components/ui";

// Every page under /traning is coach-only. Guarding here means a new page
// can't accidentally be left open to members.
export default async function TraningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(["coach", "admin"]);
  return (
    <>
      {children}
      {/* At the bottom of every coach page rather than in the header, which
          is already full on a phone. */}
      <form action={signOut} className="mt-16 space-y-2 border-t border-line pt-6">
        <p className="text-center text-sm text-muted">Inloggad som {profile.email}</p>
        <button type="submit" className={`${buttonSecondary} w-full`}>
          Logga ut
        </button>
      </form>
    </>
  );
}

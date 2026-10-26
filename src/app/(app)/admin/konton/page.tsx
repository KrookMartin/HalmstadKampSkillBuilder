import { requireRole } from "@/lib/auth";
import { getAllProfiles } from "@/features/admin/queries";
import { MemberRow } from "@/features/admin/MemberRow";
import { card } from "@/components/ui";

// Coach/admin accounts. Members don't have accounts (the app is public),
// so this lists only people you've created in the Supabase dashboard.
export default async function KontonAdminPage() {
  await requireRole(["admin"]);
  const profiles = await getAllProfiles();

  const pending = profiles.filter((p) => p.status === "pending");
  const rest = profiles.filter((p) => p.status !== "pending");

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="eyebrow">Admin</p>
        <h1 className="page-title">Konton</h1>
      </header>

      {pending.length > 0 && (
        <section className="space-y-2">
          <h2 className="section-title">
            Väntar på godkännande ({pending.length})
          </h2>
          <MemberList members={pending} />
        </section>
      )}

      <section className={`${card} space-y-2 text-sm text-text-soft`}>
        <h2 className="font-semibold text-text">Lägga till en tränare</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Supabase → Authentication → Users → <em>Add user</em>. Ange e-post och
            lösenord och kryssa i <em>Auto Confirm User</em>.
          </li>
          <li>Personen dyker upp här under ”Väntar”. Godkänn och välj roll Tränare.</li>
          <li>Ge personen e-post och lösenord. Lösenordet kan bytas i Supabase.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="section-title">Alla konton ({rest.length})</h2>
        <MemberList members={rest} />
      </section>
    </div>
  );
}

function MemberList({
  members,
}: {
  members: Awaited<ReturnType<typeof getAllProfiles>>;
}) {
  if (members.length === 0) {
    return <p className="py-4 text-muted">Inga konton att visa.</p>;
  }

  return (
    <ul className="border-t border-line">
      {members.map((m) => (
        <MemberRow key={m.id} member={m} />
      ))}
    </ul>
  );
}

import { requireRole } from "@/lib/auth";
import { getAllProfiles } from "@/features/admin/queries";
import { MemberRow } from "@/features/admin/MemberRow";

export default async function MedlemmarAdminPage() {
  await requireRole(["admin"]);
  const profiles = await getAllProfiles();

  const pending = profiles.filter((p) => p.status === "pending");
  const rest = profiles.filter((p) => p.status !== "pending");

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="eyebrow">Admin</p>
        <h1 className="page-title">Medlemmar</h1>
      </header>

      {pending.length > 0 && (
        <section className="space-y-2">
          <h2 className="section-title">
            Väntar på godkännande ({pending.length})
          </h2>
          <MemberList members={pending} />
        </section>
      )}

      <section className="space-y-2">
        <h2 className="section-title">Alla medlemmar ({rest.length})</h2>
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
    return <p className="py-4 text-muted">Inga medlemmar att visa.</p>;
  }

  return (
    <ul className="border-t border-line">
      {members.map((m) => (
        <MemberRow key={m.id} member={m} />
      ))}
    </ul>
  );
}

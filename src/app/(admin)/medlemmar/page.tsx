import { getAllProfiles } from "@/features/admin/queries";
import { MemberRow } from "@/features/admin/MemberRow";

export default async function MedlemmarAdminPage() {
  const profiles = await getAllProfiles();

  const pending = profiles.filter((p) => p.status === "pending");
  const rest = profiles.filter((p) => p.status !== "pending");

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Medlemshantering</h1>

      {pending.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-3 text-sm font-semibold text-amber-900">
            {pending.length} väntande{" "}
            {pending.length === 1 ? "ansökan" : "ansökningar"}
          </p>
          <MemberTable members={pending} />
        </section>
      )}

      <section>
        <MemberTable members={rest} />
      </section>
    </main>
  );
}

function MemberTable({
  members,
}: {
  members: Awaited<ReturnType<typeof getAllProfiles>>;
}) {
  if (members.length === 0) {
    return (
      <p className="py-4 text-sm text-gray-400">Inga medlemmar att visa.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wide text-gray-400">
            <th className="px-4 py-2">Namn / E-post</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Roll</th>
            <th className="px-4 py-2">Åtgärder</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {members.map((m) => (
            <MemberRow key={m.id} member={m} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

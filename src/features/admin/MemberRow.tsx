"use client";

import { useTransition } from "react";
import { buttonPrimary, buttonSecondary, meta, tag } from "@/components/ui";
import { updateMemberStatus, updateMemberRole } from "./actions";
import type { Profile } from "@/lib/auth";

const statusLabels: Record<Profile["status"], string> = {
  pending: "Väntar",
  active: "Aktiv",
  inactive: "Inaktiv",
};

const roleLabels: Record<Profile["role"], string> = {
  member: "Medlem",
  coach: "Tränare",
  admin: "Admin",
};

export function MemberRow({ member }: { member: Profile }) {
  const [isPending, startTransition] = useTransition();

  function setStatus(status: Profile["status"]) {
    startTransition(async () => {
      await updateMemberStatus(member.id, status);
    });
  }

  function setRole(role: Profile["role"]) {
    startTransition(async () => {
      await updateMemberRole(member.id, role);
    });
  }

  return (
    <li
      className={`space-y-3 border-b border-line py-4 ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{member.name ?? "–"}</p>
          <p className={`${meta} break-all`}>{member.email}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span
            className={
              member.status === "active"
                ? tag
                : "inline-flex items-center rounded-full border border-red-text px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-red-text"
            }
          >
            {statusLabels[member.status]}
          </span>
          <span className={meta}>{roleLabels[member.role]}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {member.status !== "active" && (
          <button
            type="button"
            onClick={() => setStatus("active")}
            disabled={isPending}
            className={
              member.status === "pending"
                ? `${buttonPrimary} min-h-[44px] w-auto flex-1 text-sm`
                : buttonSecondary
            }
          >
            {member.status === "pending" ? "Godkänn" : "Aktivera"}
          </button>
        )}
        {member.status === "active" && (
          <button
            type="button"
            onClick={() => setStatus("inactive")}
            disabled={isPending}
            className={buttonSecondary}
          >
            Inaktivera
          </button>
        )}
        {member.role !== "coach" && (
          <button
            type="button"
            onClick={() => setRole("coach")}
            disabled={isPending}
            className={buttonSecondary}
          >
            Gör till tränare
          </button>
        )}
        {member.role !== "member" && (
          <button
            type="button"
            onClick={() => setRole("member")}
            disabled={isPending}
            className={buttonSecondary}
          >
            Gör till medlem
          </button>
        )}
      </div>
    </li>
  );
}

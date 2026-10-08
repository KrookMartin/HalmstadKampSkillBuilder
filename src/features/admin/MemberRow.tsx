"use client";

import { useTransition } from "react";
import { updateMemberStatus, updateMemberRole } from "./actions";
import type { Profile } from "@/lib/auth";

const statusLabels: Record<Profile["status"], string> = {
  pending: "Väntar",
  active: "Aktiv",
  inactive: "Inaktiv",
};

const statusColors: Record<Profile["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
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
    <tr className={isPending ? "opacity-50" : ""}>
      <td className="py-3 pr-4 align-top">
        <p className="text-sm font-medium text-gray-900">
          {member.name ?? "–"}
        </p>
        <p className="text-xs text-gray-500">{member.email}</p>
      </td>

      <td className="py-3 pr-4 align-top">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[member.status]}`}
        >
          {statusLabels[member.status]}
        </span>
      </td>

      <td className="py-3 pr-4 align-top">
        <span className="text-sm text-gray-600">
          {roleLabels[member.role]}
        </span>
      </td>

      <td className="py-3 align-top">
        <div className="flex flex-wrap gap-1">
          {member.status !== "active" && (
            <button
              onClick={() => setStatus("active")}
              disabled={isPending}
              className="min-h-[36px] rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              Godkänn
            </button>
          )}
          {member.status === "active" && (
            <button
              onClick={() => setStatus("inactive")}
              disabled={isPending}
              className="min-h-[36px] rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Inaktivera
            </button>
          )}
          {member.role !== "coach" && (
            <button
              onClick={() => setRole("coach")}
              disabled={isPending}
              className="min-h-[36px] rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Gör till tränare
            </button>
          )}
          {member.role !== "member" && (
            <button
              onClick={() => setRole("member")}
              disabled={isPending}
              className="min-h-[36px] rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Gör till medlem
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

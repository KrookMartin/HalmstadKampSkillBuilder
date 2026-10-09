"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/auth";
import { isCoachArea, isStaff } from "./nav";
import { UsersIcon } from "./icons";
import { iconButton } from "./ui";

export function AppHeader({ role }: { role: Role }) {
  const pathname = usePathname();
  const inCoachArea = isCoachArea(pathname);

  return (
    <header className="shrink-0 border-b border-line bg-ink pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 max-w-xl items-center gap-3 px-5">
        <Link
          href={inCoachArea ? "/traning/pass" : "/idag"}
          className="flex min-h-[44px] items-center gap-3 rounded-control focus-visible:outline-2 focus-visible:outline-red-text"
        >
          <Image src="/logo.png" alt="" width={36} height={36} priority />
          <span className="font-display text-lg font-bold uppercase leading-none tracking-wide">
            Halmstad Kampsport
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* Coaches switch between the member view and their tools. */}
          {isStaff(role) && (
            <Link
              href={inCoachArea ? "/idag" : "/traning/pass"}
              className="flex min-h-[44px] items-center rounded-full border border-line-strong px-3.5 text-xs font-semibold uppercase tracking-wide text-text-soft hover:text-text focus-visible:outline-2 focus-visible:outline-red-text"
            >
              {inCoachArea ? "Medlem" : "Tränare"}
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin/medlemmar"
              aria-label="Medlemmar"
              aria-current={
                pathname.startsWith("/admin/medlemmar") ? "page" : undefined
              }
              className={`${iconButton} aria-[current=page]:text-red-text`}
            >
              <UsersIcon className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

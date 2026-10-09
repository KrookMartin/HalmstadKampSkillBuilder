"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/auth";
import { coachTabs, isCoachArea, isStaff, memberTabs } from "./nav";
import {
  BookIcon,
  CalendarIcon,
  ClipboardIcon,
  DumbbellIcon,
} from "./icons";

const icons = {
  calendar: CalendarIcon,
  book: BookIcon,
  dumbbell: DumbbellIcon,
  clipboard: ClipboardIcon,
};

export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const tabs =
    isStaff(role) && isCoachArea(pathname) ? coachTabs : memberTabs;

  return (
    <nav
      aria-label="Huvudmeny"
      className="shrink-0 border-t border-line bg-ink pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-xl">
        {tabs.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          const Icon = icons[icon];
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 text-xs font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-text ${
                  active ? "text-text" : "text-muted hover:text-text-soft"
                }`}
              >
                <Icon className={`h-6 w-6 ${active ? "text-red-text" : ""}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

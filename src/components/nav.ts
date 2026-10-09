import type { Role } from "@/lib/auth";

// Coach and admin pages live under these prefixes; everything else is the
// member area. Used to pick which tabs the bottom nav shows.
export function isCoachArea(pathname: string): boolean {
  return pathname.startsWith("/traning") || pathname.startsWith("/admin");
}

export function isStaff(role: Role): boolean {
  return role === "coach" || role === "admin";
}

export const memberTabs = [
  { href: "/idag", label: "Idag", icon: "calendar" },
  { href: "/tekniker", label: "Tekniker", icon: "book" },
  { href: "/styrka", label: "Styrka", icon: "dumbbell" },
] as const;

export const coachTabs = [
  { href: "/traning/pass", label: "Pass", icon: "clipboard" },
  { href: "/traning/arkiv", label: "Arkiv", icon: "book" },
  { href: "/traning/styrka", label: "Styrka", icon: "dumbbell" },
] as const;

import { Suspense } from "react";
import { getProfile } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

// Single layout for all app pages: header, scrolling <main>, bottom nav
// (DESIGN.md "Screen shell"). Member pages are public; coach pages guard
// themselves (traning/layout.tsx, admin pages).
//
// Reading the session (cookies) can't happen at build time, and with
// Cache Components that read must sit inside <Suspense>. So the layout
// itself is static and the auth check streams in as <Shell>.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col">
      <Suspense fallback={<div className="flex-1" aria-busy="true" />}>
        <Shell>{children}</Shell>
      </Suspense>
    </div>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  // null for anonymous visitors (members) and for coach accounts that
  // aren't activated yet — both get the member view.
  const profile = await getProfile();
  const role = profile?.status === "active" ? profile.role : null;

  return (
    <>
      <AppHeader role={role} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl px-5 pb-10 pt-6">{children}</div>
      </main>
      <BottomNav role={role} />
    </>
  );
}

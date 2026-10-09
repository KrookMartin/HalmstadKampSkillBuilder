import { Suspense } from "react";
import { requireActiveProfile } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

// Single layout for all authenticated pages: header, scrolling <main>,
// bottom nav (DESIGN.md "Screen shell").
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
  // Redirects to /login (not signed in) or /vantar (pending approval).
  const profile = await requireActiveProfile();

  return (
    <>
      <AppHeader role={profile.role} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl px-5 pb-10 pt-6">{children}</div>
      </main>
      <BottomNav role={profile.role} />
    </>
  );
}

// Demo layout — no auth, no DB. Remove this whole /demo folder before going live.
import Link from "next/link";

const nav = [
  { href: "/demo/idag", label: "Idag" },
  { href: "/demo/tekniker", label: "Tekniker" },
  { href: "/demo/styrka", label: "Styrka" },
  { href: "/demo/arkiv", label: "Arkiv (tränare)" },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="font-bold text-gray-900">HK Kamp</span>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            DEMO
          </span>
        </div>
      </header>

      {/* Page */}
      <div className="mx-auto max-w-2xl">{children}</div>

      {/* Bottom nav — mimics mobile PWA tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Padding so content isn't hidden behind nav */}
      <div className="h-16" />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata = {
  title: "Tränarinloggning – Halmstad Kampsport",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <Image
            src="/logo.png"
            alt="Halmstad Kampsport"
            width={112}
            height={112}
            priority
          />
          <div className="space-y-3">
            <p className="eyebrow">Tränare</p>
            <h1 className="page-title">Logga in</h1>
            <p className="text-muted">
              Medlemmar behöver inte logga in – passen och teknikerna är öppna
              för alla.
            </p>
          </div>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted">
          <Link
            href="/idag"
            className="font-semibold text-red-text underline underline-offset-4"
          >
            Tillbaka till appen
          </Link>
        </p>
      </div>
    </main>
  );
}

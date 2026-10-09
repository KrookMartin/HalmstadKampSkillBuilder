import Image from "next/image";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata = {
  title: "Logga in – Halmstad Kampsport",
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
            <h1 className="page-title">Logga in</h1>
            <p className="text-muted">
              Ange din e-post så skickar vi en inloggningslänk.
            </p>
          </div>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted">
          Inte medlem än?{" "}
          <a
            href="https://www.halmstadkampsport.se"
            className="font-semibold text-red-text underline underline-offset-4"
          >
            Läs mer om klubben
          </a>
        </p>
      </div>
    </main>
  );
}

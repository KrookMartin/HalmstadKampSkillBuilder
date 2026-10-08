import { LoginForm } from "@/features/auth/LoginForm";

export const metadata = {
  title: "Logga in – Halmstad Kampsport",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Halmstad Kampsport
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Ange din e-post så skickar vi en inloggningslänk.
          </p>
        </div>

        <LoginForm />

        <p className="text-xs text-gray-400">
          Inte medlem än?{" "}
          <a
            href="https://www.halmstadkampsport.se"
            className="underline underline-offset-2"
          >
            Läs mer om klubben
          </a>
        </p>
      </div>
    </main>
  );
}

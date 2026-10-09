import Image from "next/image";

// Shown to users whose status is still 'pending'.
// They're authenticated but not yet approved by an admin.
export default function VantarPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <Image src="/logo.png" alt="" width={88} height={88} priority />
        <div className="space-y-3">
          <p className="eyebrow">Konto skapat</p>
          <h1 className="page-title">Väntar på godkännande</h1>
        </div>
        <p className="text-text-soft">
          Ditt konto väntar på godkännande av en tränare. Du får tillgång till
          appen så snart det är klart.
        </p>
        <p className="text-sm text-muted">
          Frågor? Hör av dig till{" "}
          <a
            href="mailto:info@halmstadkampsport.se"
            className="font-semibold text-red-text underline underline-offset-4"
          >
            info@halmstadkampsport.se
          </a>
        </p>
      </div>
    </main>
  );
}

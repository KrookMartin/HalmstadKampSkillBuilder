// Shown to users whose status is still 'pending'.
// They're authenticated but not yet approved by an admin.
export default function VantarPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-xl font-bold text-gray-900">
          Din ansökan behandlas
        </h1>
        <p className="text-sm text-gray-600">
          Ditt konto är skapat men väntar på godkännande av en tränare. Du
          får tillgång till appen så snart det är klart.
        </p>
        <p className="text-xs text-gray-400">
          Frågor? Hör av dig till{" "}
          <a
            href="mailto:info@halmstadkampsport.se"
            className="underline underline-offset-2"
          >
            info@halmstadkampsport.se
          </a>
        </p>
      </div>
    </main>
  );
}

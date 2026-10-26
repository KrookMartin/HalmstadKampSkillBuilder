import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionById } from "@/features/sessions/queries";
import { SessionView } from "@/features/sessions/SessionView";
import { ChevronLeftIcon } from "@/components/icons";
import { weekStart } from "@/lib/week";

interface PageProps {
  params: Promise<{ id: string }>;
}

// A single pass from any day, opened from "Veckans pass" on /idag.
// RLS returns nothing for unpublished passes, so members get a 404.
export default async function PassPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSessionById(id);
  if (!session) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/idag?vecka=${weekStart(session.session_date)}`}
        scroll={false}
        className="-ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-control pr-3 text-sm font-semibold text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-red-text"
      >
        <ChevronLeftIcon className="h-5 w-5" />
        Veckans pass
      </Link>

      <SessionView session={session} fran={`pass-${session.id}`} />
    </div>
  );
}

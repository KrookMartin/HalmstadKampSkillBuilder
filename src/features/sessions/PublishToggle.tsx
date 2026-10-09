"use client";

import { useTransition } from "react";
import { buttonPrimary, buttonSecondary } from "@/components/ui";
import { publishSession } from "./actions";

interface PublishToggleProps {
  sessionId: string;
  published: boolean;
}

// "Publicera" is the screen's primary action; once published it becomes
// a quieter outline button so it isn't pressed by mistake.
export function PublishToggle({ sessionId, published }: PublishToggleProps) {
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await publishSession(sessionId, !published);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={published ? `${buttonSecondary} w-full` : buttonPrimary}
    >
      {isPending ? "…" : published ? "Avpublicera" : "Publicera"}
    </button>
  );
}

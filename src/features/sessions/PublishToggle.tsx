"use client";

import { useTransition } from "react";
import { publishSession } from "./actions";

interface PublishToggleProps {
  sessionId: string;
  published: boolean;
}

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
      className={`flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60
        ${published
          ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          : "bg-green-600 text-white hover:bg-green-700"
        }`}
    >
      {isPending
        ? "…"
        : published
        ? "Avpublicera"
        : "Publicera"}
    </button>
  );
}

"use client";

import { useState } from "react";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import { ChevronRightIcon } from "@/components/icons";
import { buttonDanger, buttonSecondary, meta } from "@/components/ui";
import { TechniqueForm } from "./TechniqueForm";
import { deleteTechnique } from "./actions";
import { categoryLabels, levelLabels } from "./labels";
import type { Technique } from "./queries";

interface TechniqueCardProps {
  technique: Technique;
}

// Coach archive row. Tap to expand: video preview + edit/delete.
// (Members use the /tekniker/[id] page instead.)
export function TechniqueCard({ technique }: TechniqueCardProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="border-b border-line">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex min-h-[72px] w-full items-center gap-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-red-text"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-semibold">
            {technique.title}
          </span>
          <span className={meta}>
            {categoryLabels[technique.category]} ·{" "}
            {levelLabels[technique.level]}
          </span>
        </span>
        <ChevronRightIcon
          className={`h-6 w-6 shrink-0 text-muted transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="space-y-4 pb-6 pt-1">
          {editing ? (
            <>
              <TechniqueForm
                existing={technique}
                onSuccess={() => setEditing(false)}
              />
              <button
                type="button"
                onClick={() => setEditing(false)}
                className={`${buttonSecondary} w-full`}
              >
                Avbryt
              </button>
            </>
          ) : (
            <>
              <YoutubeEmbed
                url={technique.youtube_url}
                title={technique.title}
              />
              {technique.notes && (
                <p className="whitespace-pre-line text-text-soft">
                  {technique.notes}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className={`${buttonSecondary} flex-1`}
                >
                  Redigera
                </button>
                <DeleteButton id={technique.id} />
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}

// Two-step delete so a mis-tap on a phone doesn't remove a technique.
function DeleteButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    await deleteTechnique(id);
    setPending(false);
  }

  if (confirming) {
    return (
      <div className="flex flex-1 gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className={`${buttonDanger} flex-1`}
        >
          {pending ? "Tar bort…" : "Ja, ta bort"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className={buttonSecondary}
        >
          Avbryt
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={buttonDanger}
    >
      Ta bort
    </button>
  );
}

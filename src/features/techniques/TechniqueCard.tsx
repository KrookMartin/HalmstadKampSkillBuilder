"use client";

import { useState } from "react";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import { TechniqueForm } from "./TechniqueForm";
import { deleteTechnique } from "./actions";
import { categoryLabels, levelLabels } from "./labels";
import type { Technique } from "./queries";

interface TechniqueCardProps {
  technique: Technique;
  canEdit?: boolean;
}

export function TechniqueCard({ technique, canEdit = false }: TechniqueCardProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900">{technique.title}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {categoryLabels[technique.category]} · {levelLabels[technique.level]}
          </p>
        </div>
        <span className="shrink-0 text-gray-400" aria-hidden>
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          {!editing && (
            <>
              <YoutubeEmbed url={technique.youtube_url} title={technique.title} />
              {technique.notes && (
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {technique.notes}
                </p>
              )}

              {canEdit && (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="min-h-[44px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    Redigera
                  </button>
                  <DeleteButton id={technique.id} />
                </div>
              )}
            </>
          )}

          {editing && (
            <TechniqueForm
              existing={technique}
              onSuccess={() => setEditing(false)}
            />
          )}
        </div>
      )}
    </article>
  );
}

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
      <div className="flex gap-2 flex-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="min-h-[44px] flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? "Tar bort…" : "Bekräfta"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
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
      className="min-h-[44px] rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      Ta bort
    </button>
  );
}

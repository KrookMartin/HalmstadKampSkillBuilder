"use client";

import { useState } from "react";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import { CloseIcon, PlayIcon } from "@/components/icons";
import type { ExerciseLine } from "./parseWeek";

// One exercise. Client component only because of the video toggle: the
// player (and its dead-video check) mounts on tap, so a week with ~17 videos
// doesn't load 17 iframes up front on a phone.
export function ExerciseRow({ exercise }: { exercise: ExerciseLine }) {
  const [open, setOpen] = useState(false);
  const { label, name, dose, videoUrl } = exercise;

  return (
    <li className="space-y-3 py-3">
      <div className="flex items-center gap-3">
        <span className="w-7 shrink-0 text-sm font-semibold text-red-text">
          {label}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{name}</p>
          {dose && <p className="text-sm text-muted">{dose}</p>}
        </div>
        {videoUrl && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? `Stäng video: ${name}` : `Visa video: ${name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-surface-2 text-text focus-visible:outline-2 focus-visible:outline-red-text"
          >
            {open ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {open && videoUrl && <YoutubeEmbed url={videoUrl} title={name} />}
    </li>
  );
}

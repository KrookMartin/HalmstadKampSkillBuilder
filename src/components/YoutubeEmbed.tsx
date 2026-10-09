"use client";

import { useState } from "react";
import { buildEmbedUrl, parseYoutubeUrl } from "@/lib/youtube";
import { ExternalIcon, WarningIcon } from "./icons";

interface YoutubeEmbedProps {
  url: string;
  title: string;
}

// Renders a responsive 16:9 YouTube embed with a fallback if the URL is
// invalid or the video fails to load (dead links, region blocks, etc.).
export function YoutubeEmbed({ url, title }: YoutubeEmbedProps) {
  const [failed, setFailed] = useState(false);
  const parsed = parseYoutubeUrl(url);

  if (!parsed || failed) {
    // Same 16:9 box as the player so the layout doesn't jump.
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-card border border-line bg-surface px-6 text-center">
        <WarningIcon className="h-8 w-8 text-red-text" />
        <p className="font-semibold">Videon går inte att spela</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-red-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-red-text"
        >
          Öppna på YouTube
          <ExternalIcon className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-black">
      <iframe
        src={buildEmbedUrl(parsed)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

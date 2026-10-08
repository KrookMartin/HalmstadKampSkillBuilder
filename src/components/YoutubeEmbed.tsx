"use client";

import { useState } from "react";
import { buildEmbedUrl, parseYoutubeUrl } from "@/lib/youtube";

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
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gray-100 text-center text-sm text-gray-500">
        <div className="space-y-1 px-4">
          <p className="font-medium">Videon går inte att spela</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-gray-700"
          >
            Öppna på YouTube
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
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

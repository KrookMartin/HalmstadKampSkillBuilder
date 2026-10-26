"use client";

import { useEffect, useState } from "react";
import { buildEmbedUrl, parseYoutubeUrl } from "@/lib/youtube";
import { ExternalIcon, WarningIcon } from "./icons";

interface YoutubeEmbedProps {
  url: string;
  title: string;
}

// Renders a responsive 16:9 YouTube embed with a fallback if the URL is
// invalid or the video is gone (deleted, private, embedding disabled).
export function YoutubeEmbed({ url, title }: YoutubeEmbedProps) {
  const [failed, setFailed] = useState(false);
  const parsed = parseYoutubeUrl(url);
  const videoId = parsed?.videoId;

  // A dead video still loads YouTube's own error page inside the iframe, so
  // the iframe's onError never fires. Instead we ask YouTube's oEmbed
  // endpoint (allowed from the browser, no API key): it answers 4xx for
  // deleted/private/non-embeddable videos. Network errors or 5xx keep the
  // player, so a flaky connection doesn't show a false "dead video".
  useEffect(() => {
    if (!videoId) return;
    const controller = new AbortController();
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl)}`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (res.status >= 400 && res.status < 500) setFailed(true);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [videoId]);

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
      />
    </div>
  );
}

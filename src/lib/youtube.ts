// Parses a YouTube URL into a video ID and optional start time (seconds).
// Handles the most common URL formats coaches will paste:
//   https://www.youtube.com/watch?v=VIDEO_ID&t=90
//   https://youtu.be/VIDEO_ID?t=90
//   https://www.youtube.com/embed/VIDEO_ID
//   https://www.youtube.com/shorts/VIDEO_ID

export interface YoutubeVideo {
  videoId: string;
  startSeconds: number;
}

export function parseYoutubeUrl(url: string): YoutubeVideo | null {
  let videoId: string | null = null;
  let startSeconds = 0;

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (host === "youtube.com") {
      const path = parsed.pathname;
      if (path.startsWith("/watch")) {
        videoId = parsed.searchParams.get("v");
      } else if (path.startsWith("/embed/")) {
        videoId = path.split("/embed/")[1].split("/")[0];
      } else if (path.startsWith("/shorts/")) {
        videoId = path.split("/shorts/")[1].split("/")[0];
      }
    }

    if (!videoId) return null;

    // Strip any extra path segments or query params from the ID itself
    videoId = videoId.split("?")[0].split("&")[0];

    const tParam = parsed.searchParams.get("t");
    if (tParam) {
      startSeconds = parseStartTime(tParam);
    }
  } catch {
    return null;
  }

  if (!isValidVideoId(videoId)) return null;

  return { videoId, startSeconds };
}

export function buildEmbedUrl({ videoId, startSeconds }: YoutubeVideo): string {
  const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
  return startSeconds > 0 ? `${base}?start=${startSeconds}` : base;
}

// Parses "90", "1m30s", "1h5m" etc. into total seconds.
function parseStartTime(t: string): number {
  const asInt = parseInt(t, 10);
  if (!isNaN(asInt) && String(asInt) === t) return asInt;

  let total = 0;
  const hours = t.match(/(\d+)h/);
  const minutes = t.match(/(\d+)m/);
  const seconds = t.match(/(\d+)s/);
  if (hours) total += parseInt(hours[1], 10) * 3600;
  if (minutes) total += parseInt(minutes[1], 10) * 60;
  if (seconds) total += parseInt(seconds[1], 10);
  return total;
}

function isValidVideoId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

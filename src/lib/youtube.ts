// Parses a YouTube URL into a video ID and optional start time (seconds).
// Handles the URL formats coaches paste, from desktop and from phones:
//   https://www.youtube.com/watch?v=VIDEO_ID&t=90
//   https://m.youtube.com/watch?v=VIDEO_ID        (mobile browser)
//   https://music.youtube.com/watch?v=VIDEO_ID
//   https://youtu.be/VIDEO_ID?t=90                (share button)
//   https://www.youtube.com/embed/VIDEO_ID
//   https://www.youtube-nocookie.com/embed/VIDEO_ID
//   https://www.youtube.com/shorts/VIDEO_ID
//   https://www.youtube.com/live/VIDEO_ID

export interface YoutubeVideo {
  videoId: string;
  startSeconds: number;
}

// Explicit allow-list: comparing the whole hostname means look-alikes such as
// "youtube.com.evil.com" or "notyoutube.com" never match.
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
]);
const NOCOOKIE_HOSTS = new Set(["youtube-nocookie.com", "www.youtube-nocookie.com"]);
const SHORT_HOST = "youtu.be";

// Paths of the form /<prefix>/VIDEO_ID on youtube.com.
const ID_PATH_PREFIXES = ["embed", "shorts", "live"];

export function parseYoutubeUrl(url: string): YoutubeVideo | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

  const videoId = extractVideoId(parsed);
  if (!videoId || !isValidVideoId(videoId)) return null;

  // Share links use ?t=, embed links use ?start=.
  const t = parsed.searchParams.get("t") ?? parsed.searchParams.get("start");
  const startSeconds = t ? parseStartTime(t) : 0;

  return { videoId, startSeconds };
}

function extractVideoId(parsed: URL): string | null {
  const host = parsed.hostname.toLowerCase();
  // "/embed/ID/" → ["embed", "ID"]
  const segments = parsed.pathname.split("/").filter(Boolean);

  if (host === SHORT_HOST) {
    return segments[0] ?? null;
  }

  if (NOCOOKIE_HOSTS.has(host)) {
    return segments[0] === "embed" ? (segments[1] ?? null) : null;
  }

  if (YOUTUBE_HOSTS.has(host)) {
    if (segments[0] === "watch") return parsed.searchParams.get("v");
    if (ID_PATH_PREFIXES.includes(segments[0])) return segments[1] ?? null;
  }

  return null;
}

export function buildEmbedUrl({ videoId, startSeconds }: YoutubeVideo): string {
  const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
  return startSeconds > 0 ? `${base}?start=${startSeconds}` : base;
}

// Parses "90", "90s", "1m30s", "1h5m" etc. into total seconds.
function parseStartTime(t: string): number {
  if (/^\d+$/.test(t)) return parseInt(t, 10);

  let total = 0;
  const hours = t.match(/(\d+)h/);
  const minutes = t.match(/(\d+)m/);
  const seconds = t.match(/(\d+)s/);
  if (hours) total += parseInt(hours[1], 10) * 3600;
  if (minutes) total += parseInt(minutes[1], 10) * 60;
  if (seconds) total += parseInt(seconds[1], 10);
  return total;
}

// YouTube video IDs are always exactly 11 characters from this set.
function isValidVideoId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

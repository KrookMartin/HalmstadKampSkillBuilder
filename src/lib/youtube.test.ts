import { describe, it, expect } from "vitest";
import { parseYoutubeUrl, buildEmbedUrl } from "./youtube";

describe("parseYoutubeUrl", () => {
  it("parses a standard watch URL", () => {
    const result = parseYoutubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(result).toEqual({ videoId: "dQw4w9WgXcQ", startSeconds: 0 });
  });

  it("parses a youtu.be short URL", () => {
    const result = parseYoutubeUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(result).toEqual({ videoId: "dQw4w9WgXcQ", startSeconds: 0 });
  });

  it("parses a youtu.be URL with start time", () => {
    const result = parseYoutubeUrl("https://youtu.be/dQw4w9WgXcQ?t=90");
    expect(result).toEqual({ videoId: "dQw4w9WgXcQ", startSeconds: 90 });
  });

  it("parses a watch URL with numeric t param", () => {
    const result = parseYoutubeUrl(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=125"
    );
    expect(result).toEqual({ videoId: "dQw4w9WgXcQ", startSeconds: 125 });
  });

  it("parses a watch URL with t param in HH:MM format (1m30s)", () => {
    const result = parseYoutubeUrl(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m30s"
    );
    expect(result).toEqual({ videoId: "dQw4w9WgXcQ", startSeconds: 90 });
  });

  it("parses an embed URL", () => {
    const result = parseYoutubeUrl(
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    );
    expect(result).toEqual({ videoId: "dQw4w9WgXcQ", startSeconds: 0 });
  });

  it("parses a shorts URL", () => {
    const result = parseYoutubeUrl(
      "https://www.youtube.com/shorts/dQw4w9WgXcQ"
    );
    expect(result).toEqual({ videoId: "dQw4w9WgXcQ", startSeconds: 0 });
  });

  it("trims whitespace around the URL", () => {
    const result = parseYoutubeUrl("  https://youtu.be/dQw4w9WgXcQ  ");
    expect(result).not.toBeNull();
    expect(result?.videoId).toBe("dQw4w9WgXcQ");
  });

  it("returns null for a non-YouTube URL", () => {
    expect(parseYoutubeUrl("https://vimeo.com/123456")).toBeNull();
  });

  it("returns null for a malformed URL", () => {
    expect(parseYoutubeUrl("not-a-url")).toBeNull();
  });

  it("returns null for a YouTube URL with no video ID", () => {
    expect(parseYoutubeUrl("https://www.youtube.com/watch?v=")).toBeNull();
  });
});

describe("buildEmbedUrl", () => {
  it("builds a nocookie embed URL without start", () => {
    const url = buildEmbedUrl({ videoId: "abc12345678", startSeconds: 0 });
    expect(url).toBe("https://www.youtube-nocookie.com/embed/abc12345678");
  });

  it("appends start param when startSeconds > 0", () => {
    const url = buildEmbedUrl({ videoId: "abc12345678", startSeconds: 45 });
    expect(url).toBe(
      "https://www.youtube-nocookie.com/embed/abc12345678?start=45"
    );
  });
});

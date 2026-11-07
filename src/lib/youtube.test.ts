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

  it.each([
    ["mobile watch URL", "https://m.youtube.com/watch?v=dQw4w9WgXcQ"],
    ["YouTube Music URL", "https://music.youtube.com/watch?v=dQw4w9WgXcQ"],
    ["watch URL without www", "https://youtube.com/watch?v=dQw4w9WgXcQ"],
    ["live URL", "https://www.youtube.com/live/dQw4w9WgXcQ"],
    ["nocookie embed URL", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    ["mobile shorts URL", "https://m.youtube.com/shorts/dQw4w9WgXcQ"],
    ["share link with si param", "https://youtu.be/dQw4w9WgXcQ?si=AbCdEf123"],
    ["uppercase host", "https://WWW.YOUTUBE.COM/watch?v=dQw4w9WgXcQ"],
    ["http instead of https", "http://www.youtube.com/watch?v=dQw4w9WgXcQ"],
  ])("parses a %s", (_name, url) => {
    expect(parseYoutubeUrl(url)).toEqual({
      videoId: "dQw4w9WgXcQ",
      startSeconds: 0,
    });
  });

  it("parses the start param on embed links", () => {
    const result = parseYoutubeUrl(
      "https://www.youtube.com/embed/dQw4w9WgXcQ?start=42"
    );
    expect(result).toEqual({ videoId: "dQw4w9WgXcQ", startSeconds: 42 });
  });

  it("parses a t param with only seconds suffix (90s)", () => {
    const result = parseYoutubeUrl("https://youtu.be/dQw4w9WgXcQ?t=90s");
    expect(result).toEqual({ videoId: "dQw4w9WgXcQ", startSeconds: 90 });
  });

  it.each([
    ["look-alike host", "https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ"],
    ["host containing youtube", "https://notyoutube.com/watch?v=dQw4w9WgXcQ"],
    ["www in the path", "https://evil.com/www.youtube.com/watch?v=dQw4w9WgXcQ"],
    ["too short ID", "https://youtu.be/dQw4w9WgXc"],
    ["too long ID", "https://youtu.be/dQw4w9WgXcQQ"],
    ["invalid characters in ID", "https://youtu.be/dQw4w9WgX!Q"],
    ["embed path without ID", "https://www.youtube.com/embed/"],
    ["channel page", "https://www.youtube.com/@somechannel"],
    ["nocookie non-embed path", "https://www.youtube-nocookie.com/watch?v=dQw4w9WgXcQ"],
    ["javascript scheme", "javascript://youtu.be/dQw4w9WgXcQ"],
    ["empty string", ""],
  ])("returns null for a %s", (_name, url) => {
    expect(parseYoutubeUrl(url)).toBeNull();
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

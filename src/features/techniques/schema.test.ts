import { describe, it, expect } from "vitest";
import { parseTechniqueForm } from "./schema";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  const defaults = {
    title: "Armbar från closed guard",
    category: "upper_body_submissions",
    level: "beginner",
    youtube_url: "https://youtu.be/dQw4w9WgXcQ",
    notes: "",
  };
  for (const [key, value] of Object.entries({ ...defaults, ...fields })) {
    fd.set(key, value);
  }
  return fd;
}

function errorFor(fields: Record<string, string>) {
  const result = parseTechniqueForm(form(fields));
  return result.success ? null : result.error.issues[0].message;
}

describe("techniqueSchema – youtube_url", () => {
  it.each([
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ?t=90",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/shorts/dQw4w9WgXcQ",
  ])("accepts %s", (url) => {
    expect(parseTechniqueForm(form({ youtube_url: url })).success).toBe(true);
  });

  it.each([
    "https://google.com",
    "https://vimeo.com/123456",
    "inte en länk",
    "",
  ])("rejects %j with a Swedish message", (url) => {
    expect(errorFor({ youtube_url: url })).toMatch(/giltig YouTube-länk/);
  });

  it("trims whitespace around the link before saving", () => {
    const result = parseTechniqueForm(
      form({ youtube_url: "  https://youtu.be/dQw4w9WgXcQ  " })
    );
    expect(result.success && result.data.youtube_url).toBe(
      "https://youtu.be/dQw4w9WgXcQ"
    );
  });

  it("rejects a missing youtube_url field", () => {
    const fd = form({});
    fd.delete("youtube_url");
    const result = parseTechniqueForm(fd);
    expect(result.success).toBe(false);
  });
});

describe("techniqueSchema – other fields", () => {
  it("turns empty notes into null so clearing them works", () => {
    const result = parseTechniqueForm(form({ notes: "   " }));
    expect(result.success && result.data.notes).toBeNull();
  });

  it("keeps non-empty notes", () => {
    const result = parseTechniqueForm(form({ notes: "Håll armbågen tight" }));
    expect(result.success && result.data.notes).toBe("Håll armbågen tight");
  });

  it("rejects a too short title", () => {
    expect(errorFor({ title: "A" })).toBe("Titeln måste vara minst 2 tecken");
  });

  it("rejects an unknown category", () => {
    expect(errorFor({ category: "leglocks" })).toBe("Välj en kategori");
  });

  it("rejects an unknown level", () => {
    expect(errorFor({ level: "expert" })).toBe("Välj en nivå");
  });
});

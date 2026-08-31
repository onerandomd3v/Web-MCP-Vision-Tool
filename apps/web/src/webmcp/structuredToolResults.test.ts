import { describe, expect, it } from "vitest";
import { withoutImageUrl, withoutImageUrls } from "./structuredToolResults";

describe("structured WebMCP result shaping", () => {
  it("does not leak an image from a routine product result", () => {
    expect(withoutImageUrl({ slug: "machine", name: "Machine", imageUrl: "https://example.com/m.jpg" })).toEqual({
      slug: "machine",
      name: "Machine",
    });
  });

  it("strips images from every routine search result", () => {
    expect(withoutImageUrls([
      { slug: "a", imageUrl: "a.jpg" },
      { slug: "b", imageUrl: "b.jpg" },
    ])).toEqual([{ slug: "a" }, { slug: "b" }]);
  });
});

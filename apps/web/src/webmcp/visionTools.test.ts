import { describe, expect, it } from "vitest";
import {
  assertBoundedProductIds,
  buildBestFitContext,
  selectVisionProducts,
  toProductImageResult,
} from "./visionTools";

describe("toProductImageResult", () => {
  it("returns a targeted image reference without extra product data", () => {
    expect(
      toProductImageResult({
        slug: "minimal-machine",
        name: "Minimal Machine",
        imageUrl: "https://example.com/minimal-machine.jpg",
      }),
    ).toEqual({
      productId: "minimal-machine",
      name: "Minimal Machine",
      imageUrl: "https://example.com/minimal-machine.jpg",
    });
  });

  it("rejects a product with no image", () => {
    expect(() =>
      toProductImageResult({ slug: "missing-image", name: "Missing", imageUrl: null }),
    ).toThrow("does not have an image available");
  });
});

describe("assertBoundedProductIds", () => {
  it("accepts one to three non-empty product IDs", () => {
    expect(assertBoundedProductIds(["a", "b"])).toEqual(["a", "b"]);
  });

  it("rejects invalid, empty, and oversized lists", () => {
    expect(() => assertBoundedProductIds([])).toThrow();
    expect(() => assertBoundedProductIds(["a", "b", "c", "d"])).toThrow();
    expect(() => assertBoundedProductIds(["a", ""])).toThrow();
    expect(() => assertBoundedProductIds(["a", 2])).toThrow();
    expect(() => assertBoundedProductIds(["a", "a"])).toThrow("duplicates");
  });
});

describe("vision result composition", () => {
  const products = [
    { slug: "a", name: "A", imageUrl: "https://example.com/a.jpg" },
    { slug: "b", name: "B", imageUrl: "https://example.com/b.jpg" },
    { slug: "c", name: "C", imageUrl: "https://example.com/c.jpg" },
  ];

  it("preserves requested candidate order and rejects unknown products", () => {
    expect(selectVisionProducts(products, ["c", "a"])).toEqual([
      { productId: "c", name: "C", imageUrl: "https://example.com/c.jpg" },
      { productId: "a", name: "A", imageUrl: "https://example.com/a.jpg" },
    ]);
    expect(() => selectVisionProducts(products, ["missing", "a"])).toThrow(
      "Unknown product slug",
    );
  });

  it("builds preference context without claiming server-side vision", () => {
    const candidate = [toProductImageResult(products[0])];
    expect(buildBestFitContext(candidate, "sleek and black")).toMatchObject({
      preference: "sleek and black",
      recommendationPrompt: expect.stringContaining("sleek and black"),
    });
    expect(() => buildBestFitContext(candidate, " ")).toThrow();
  });
});

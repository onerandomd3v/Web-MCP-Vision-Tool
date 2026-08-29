export type VisionProduct = {
  slug: string;
  name: string;
  imageUrl: string | null | undefined;
};

export type ProductImageResult = {
  productId: string;
  name: string;
  imageUrl: string;
};

/** Shape one catalog product for targeted visual reasoning. */
export function toProductImageResult(product: VisionProduct): ProductImageResult {
  if (!product.imageUrl) {
    throw new Error(`Product '${product.slug}' does not have an image available.`);
  }
  return {
    productId: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
  };
}

export function assertBoundedProductIds(
  productIds: unknown,
  min = 1,
  max = 3,
): string[] {
  if (!Array.isArray(productIds) || productIds.length < min || productIds.length > max) {
    throw new Error(`productIds must contain between ${min} and ${max} products.`);
  }
  const ids = productIds.filter((id): id is string => typeof id === "string");
  if (ids.length !== productIds.length || ids.some((id) => id.trim() === "")) {
    throw new Error("productIds must contain non-empty strings only.");
  }
  return ids;
}

export function selectVisionProducts<T extends VisionProduct>(
  products: T[],
  productIds: unknown,
  min = 2,
  max = 3,
): ProductImageResult[] {
  const ids = assertBoundedProductIds(productIds, min, max);
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return ids.map((id) => {
    const product = bySlug.get(id);
    if (!product) throw new Error(`Unknown product slug '${id}'.`);
    return toProductImageResult(product);
  });
}

export function buildPhotoMatchResult(
  photoUrl: unknown,
  candidates: ProductImageResult[],
) {
  if (typeof photoUrl !== "string" || photoUrl.trim() === "") {
    throw new Error("A photo URL is required for visual matching.");
  }
  return { userPhoto: photoUrl, candidates };
}

export function buildBestFitContext(
  candidates: ProductImageResult[],
  userPreference: unknown,
) {
  if (typeof userPreference !== "string" || userPreference.trim() === "") {
    throw new Error("A visual preference is required for best-fit selection.");
  }
  return {
    preference: userPreference.trim(),
    candidates,
    recommendationPrompt: `Choose the best visual fit for: ${userPreference.trim()}. Explain the visible trade-offs using only the supplied candidate images.`,
    reasoning: "Use the candidate images and preference for multimodal visual reasoning.",
  };
}

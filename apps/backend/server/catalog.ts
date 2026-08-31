export type CatalogProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceCents: number;
  currency: string;
  shortBlurb: string;
  imageUrl: string;
  colorOptions: string[];
  inStock: boolean;
  basketMm: number | null;
  pfStandards: string[];
  pfMaybeStandards: string[];
  espressoCapable: boolean | null;
  compatibleMachineSlugs: string[];
  isUniversal: boolean;
  specs: unknown;
};

export function listProducts(
  products: CatalogProduct[],
  filters: { query?: string; category?: string } = {},
): CatalogProduct[] {
  const query = filters.query?.trim().toLowerCase();
  return products
    .filter((product) => !filters.category || product.category === filters.category)
    .filter((product) => {
      if (!query) return true;
      return [product.name, product.brand, product.slug, product.shortBlurb]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) || b.priceCents - a.priceCents,
    );
}

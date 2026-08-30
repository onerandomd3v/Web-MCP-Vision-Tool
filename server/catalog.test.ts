import { describe, expect, it } from "vitest";
import { listProducts, type CatalogProduct } from "./catalog";

const products: CatalogProduct[] = [
  {
    id: 2,
    slug: "zeta-machine",
    name: "Zeta Machine",
    brand: "Zeta",
    category: "MACHINE",
    priceCents: 12000,
    currency: "EUR",
    shortBlurb: "A compact machine.",
    imageUrl: "https://example.com/zeta.jpg",
    colorOptions: [],
    inStock: true,
    basketMm: 58,
    pfStandards: [],
    pfMaybeStandards: [],
    espressoCapable: null,
    compatibleMachineSlugs: [],
    isUniversal: false,
    specs: {},
  },
  {
    id: 1,
    slug: "alpha-grinder",
    name: "Alpha Grinder",
    brand: "Alpha",
    category: "GRINDER",
    priceCents: 18000,
    currency: "EUR",
    shortBlurb: "A quiet grinder.",
    imageUrl: "https://example.com/alpha.jpg",
    colorOptions: [],
    inStock: true,
    basketMm: null,
    pfStandards: [],
    pfMaybeStandards: [],
    espressoCapable: true,
    compatibleMachineSlugs: [],
    isUniversal: false,
    specs: {},
  },
];

describe("listProducts", () => {
  it("filters by category and orders by category then descending price", () => {
    expect(listProducts(products)).toEqual([products[0], products[1]]);
    expect(listProducts(products, { category: "GRINDER" })).toEqual([products[1]]);
  });

  it("matches query text across product fields", () => {
    expect(listProducts(products, { query: "quiet" })).toEqual([products[1]]);
    expect(listProducts(products, { query: "ZETA" })).toEqual([products[0]]);
  });
});

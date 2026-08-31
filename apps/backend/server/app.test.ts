import { afterEach, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import { createApp } from "./app";

const product = {
  id: 1,
  slug: "alpha-machine",
  name: "Alpha Machine",
  brand: "Alpha",
  category: "MACHINE",
  priceCents: 12000,
  currency: "EUR",
  shortBlurb: "Compact.",
  imageUrl: "https://example.com/alpha.jpg",
  colorOptions: [],
  inStock: true,
  basketMm: 58,
  pfStandards: [],
  pfMaybeStandards: [],
  espressoCapable: null,
  compatibleMachineSlugs: [],
  isUniversal: false,
  specs: {},
};

const servers: Server[] = [];

afterEach(() => {
  for (const server of servers.splice(0)) server.close();
});

describe("API app", () => {
  it("serves health and catalog routes", async () => {
    const app = createApp({
      product: {
        findMany: async () => [product],
        findUnique: async () => product,
      },
    });
    const server = app.listen(0);
    servers.push(server);
    await new Promise<void>((resolve) => server.once("listening", () => resolve()));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("No test port");

    const health = await fetch(`http://127.0.0.1:${address.port}/health`);
    expect(health.status).toBe(200);
    expect(await health.json()).toEqual({ ok: true });

    const products = await fetch(`http://127.0.0.1:${address.port}/api/products`);
    expect(products.status).toBe(200);
    expect(await products.json()).toEqual([product]);
  });
});

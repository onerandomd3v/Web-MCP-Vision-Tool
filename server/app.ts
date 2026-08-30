import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import type { PrismaClient } from "@prisma/client";
import { listProducts, type CatalogProduct } from "./catalog.js";

export type ProductRepository = {
  product: {
    findMany: (args?: unknown) => Promise<CatalogProduct[]>;
    findUnique: (args: unknown) => Promise<CatalogProduct | null>;
  };
};

export function createApp(prisma: ProductRepository) {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.get("/api/products", async (req, res, next) => {
    try {
      const products = await prisma.product.findMany();
      const category = typeof req.query.category === "string" ? req.query.category : undefined;
      const query = typeof req.query.query === "string" ? req.query.query : undefined;
      res.json(listProducts(products, { category, query }));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:slug", async (req, res, next) => {
    try {
      const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
      if (!product) {
        res.status(404).json({ error: `Unknown product slug '${req.params.slug}'.` });
        return;
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    res.status(500).json({ error: message });
  });

  return app;
}

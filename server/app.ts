import cors from "cors";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import type { PrismaClient } from "@prisma/client";
import { listProducts, type CatalogProduct } from "./catalog.js";
import { authenticate, clearSession, createUser, readUserId, setSession } from "./auth.js";

export type ProductRepository = {
  product: {
    findMany: (args?: unknown) => Promise<CatalogProduct[]>;
    findUnique: (args: unknown) => Promise<CatalogProduct | null>;
  };
  user: {
    findUnique: (args: unknown) => Promise<any>;
    create: (args: unknown) => Promise<any>;
  };
};

export function createApp(prisma: ProductRepository) {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.get("/api/auth/me", async (req, res, next) => {
    try {
      const userId = readUserId(req);
      if (!userId) { res.status(401).json({ error: "Not authenticated." }); return; }
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) { res.status(401).json({ error: "Not authenticated." }); return; }
      res.json({ id: user.id, displayName: user.displayName, region: user.region });
    } catch (error) { next(error); }
  });

  app.post("/api/auth/signup", async (req, res, next) => {
    try {
      const user = await createUser(prisma, String(req.body?.username ?? ""), String(req.body?.password ?? ""), String(req.body?.displayName ?? ""));
      setSession(res, user.id);
      res.status(201).json({ id: user.id, displayName: user.displayName, region: user.region });
    } catch (error) { res.status(400).json({ error: error instanceof Error ? error.message : "Unable to sign up." }); }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const user = await authenticate(prisma, String(req.body?.username ?? ""), String(req.body?.password ?? ""));
      setSession(res, user.id);
      res.json({ id: user.id, displayName: user.displayName, region: user.region });
    } catch (error) { res.status(401).json({ error: error instanceof Error ? error.message : "Unable to log in." }); }
  });

  app.post("/api/auth/logout", (_req, res) => { clearSession(res); res.status(204).end(); });

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

import cors from "cors";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import type { PrismaClient } from "@prisma/client";
import { listProducts, type CatalogProduct } from "./catalog.js";
import { authenticate, clearSession, createUser, readUserId, setSession } from "./auth.js";

export type ProductRepository = any;

const summary = (p: any) => ({
  slug: p.slug, name: p.name, brand: p.brand, category: p.category,
  priceCents: p.priceCents, currency: p.currency, shortBlurb: p.shortBlurb,
  imageUrl: p.imageUrl, colorOptions: p.colorOptions, inStock: p.inStock,
  basketMm: p.basketMm, pfStandards: p.pfStandards, pfMaybeStandards: p.pfMaybeStandards,
  espressoCapable: p.espressoCapable, compatibleMachineSlugs: p.compatibleMachineSlugs,
  isUniversal: p.isUniversal,
});

function requireUser(req: Request) {
  const id = readUserId(req);
  if (!id) { const error = new Error("You must be logged in."); (error as any).status = 401; throw error; }
  return id;
}

async function cartView(prisma: any, userId: number) {
  const items = await prisma.cartItem.findMany({ where: { userId }, orderBy: { id: "asc" }, include: { product: true } });
  const lines = items.map((i: any) => ({ slug: i.product.slug, name: i.product.name, color: i.color, quantity: i.quantity, unitPriceCents: i.product.priceCents, lineTotalCents: i.product.priceCents * i.quantity, imageUrl: i.product.imageUrl }));
  const subtotalCents = lines.reduce((n: number, l: any) => n + l.lineTotalCents, 0);
  const applied = await prisma.userCoupon.findFirst({ where: { userId, applied: true, usedAt: null }, include: { coupon: true } });
  const coupon = applied && subtotalCents ? { code: applied.couponCode, percentOff: applied.coupon.percentOff, discountCents: Math.round(subtotalCents * applied.coupon.percentOff / 100) } : null;
  return { lines, subtotalCents, coupon, totalCents: subtotalCents - (coupon?.discountCents ?? 0) };
}

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

  app.all("/api/operations/:name", async (req, res, next) => {
    try {
      const name = req.params.name;
      const args = (req.body ?? {}) as any;
      const userId = ["getMyGear", "checkCompatibility", "getCompareList", "setCompareList", "getCart", "getMyCoupons", "addToCart", "updateCartQuantity", "removeFromCart", "applyCoupon", "placeOrder"].includes(name) ? requireUser(req) : null;
      if (name === "compareProducts") {
        const products = await Promise.all((args.slugs ?? []).map((slug: string) => prisma.product.findUnique({ where: { slug } })));
        if (products.length < 2 || products.length > 3 || products.some((p: any) => !p)) return res.status(400).json({ error: "compare_products needs 2–3 valid product slugs." });
        const specs = products.map((p: any) => p.specs ?? {}); const keys = [...new Set(specs.flatMap((s: any) => Object.keys(s)))];
        return res.json({ products: products.map(summary), rows: keys.map((key) => { const e = specs.find((s: any) => s[key])?.[key]; const values = specs.map((s: any) => s[key]?.value ?? "—"); return { key, label: e?.label ?? key, group: e?.group ?? "Specs", ...(e?.unit ? { unit: e.unit } : {}), values, differs: new Set(values).size > 1 }; }) });
      }
      if (name === "getCompareList") return res.json((await prisma.compareItem.findMany({ where: { userId }, orderBy: { position: "asc" }, include: { product: true } })).map((i: any) => summary(i.product)));
      if (name === "setCompareList") {
        const products = await prisma.product.findMany({ where: { slug: { in: args.slugs ?? [] } } });
        await prisma.compareItem.deleteMany({ where: { userId } });
        await prisma.compareItem.createMany({ data: products.map((p: any, position: number) => ({ userId, productId: p.id, position })) });
        return res.json(products.map(summary));
      }
      if (name === "getCart") return res.json(await cartView(prisma, userId!));
      if (name === "getMyCoupons") return res.json((await prisma.userCoupon.findMany({ where: { userId }, include: { coupon: true } })).map((u: any) => ({ code: u.couponCode, percentOff: u.coupon.percentOff, description: u.coupon.description, applied: u.applied, usedAt: u.usedAt })));
      if (["addToCart", "updateCartQuantity", "removeFromCart", "applyCoupon"].includes(name)) {
        const product = args.slug ? await prisma.product.findUnique({ where: { slug: args.slug } }) : null;
        if (name === "addToCart") {
          if (!product) return res.status(400).json({ error: "Unknown product slug." });
          const color = (args.color || product.colorOptions?.[0] || ""); const quantity = Math.max(1, Math.min(9, Number(args.quantity ?? 1)));
          const existing = await prisma.cartItem.findUnique({ where: { userId_productId_color: { userId: userId!, productId: product.id, color } } });
          if (existing) await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: Math.min(9, existing.quantity + quantity) } }); else await prisma.cartItem.create({ data: { userId, productId: product.id, color, quantity } });
        } else if (name === "applyCoupon") {
          const code = String(args.code ?? "").toUpperCase(); const coupon = await prisma.userCoupon.findUnique({ where: { userId_couponCode: { userId: userId!, couponCode: code } } });
          if (!coupon) return res.status(400).json({ error: `You don't have the coupon '${code}'.` });
          await prisma.userCoupon.updateMany({ where: { userId, applied: true, usedAt: null }, data: { applied: false } }); await prisma.userCoupon.update({ where: { id: coupon.id }, data: { applied: true } });
        } else {
          if (!product) return res.status(400).json({ error: "Unknown product slug." }); const lines = await prisma.cartItem.findMany({ where: { userId, productId: product.id } }); const line = lines.find((l: any) => !args.color || l.color.toLowerCase() === String(args.color).toLowerCase()); if (!line) return res.status(400).json({ error: `${product.name} is not in the cart.` });
          if (name === "removeFromCart" || Number(args.quantity) === 0) await prisma.cartItem.delete({ where: { id: line.id } }); else await prisma.cartItem.update({ where: { id: line.id }, data: { quantity: Math.max(1, Math.min(9, Number(args.quantity))) } });
        }
        return res.json(await cartView(prisma, userId!));
      }
      if (name === "placeOrder") { const cart = await cartView(prisma, userId!); if (!cart.lines.length) return res.status(400).json({ error: "The cart is empty; add something first." }); const items = await prisma.cartItem.findMany({ where: { userId }, include: { product: true } }); const order = await prisma.order.create({ data: { userId, totalCents: cart.totalCents, couponCode: cart.coupon?.code ?? null, items: { create: items.map((i: any) => ({ productId: i.productId, quantity: i.quantity, priceCents: i.product.priceCents, color: i.color || null })) } } }); await prisma.cartItem.deleteMany({ where: { userId } }); return res.json({ orderId: order.id, totalCents: cart.totalCents }); }
      if (name === "getMyGear") { const orders = await prisma.order.findMany({ where: { userId }, orderBy: { placedAt: "desc" }, include: { items: { include: { product: true } } } }); return res.json({ gear: [...new Map(orders.flatMap((o: any) => o.items.map((i: any) => [i.product.slug, { ...summary(i.product), purchasedAt: o.placedAt, orderId: o.id }]))).values()], orders }); }
      return res.status(404).json({ error: `Unknown operation '${name}'.` });
    } catch (error) { next(error); }
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    res.status((error as any)?.status ?? 500).json({ error: message });
  });

  return app;
}

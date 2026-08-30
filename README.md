# WebMCP Vision Tool

WebMCP Vision Tool is an agent-ready shopping experience for visual product decisions. It combines fast, structured commerce actions with focused product imagery, so an AI agent can answer questions about appearance without relying on full-page screenshots or guesswork.

## The experience

Shoppers can search the catalog, inspect product details, compare specifications, evaluate appearance, match products to a room photo, and add products to a cart. The application uses two complementary tool layers:

- Structured tools handle discovery, filtering, product details, compatibility, cart actions, coupons, and checkout.
- Vision tools provide bounded product-image references when a request needs a visual judgment about finish, color, shape, or style.

The application supplies product data and image references. A multimodal agent performs the visual interpretation; this project does not pretend to be an image model.

## Vision tools

| Tool | Purpose |
| --- | --- |
| `getProductImage` | Return one product image and its metadata for visual evaluation. |
| `compareProductAesthetics` | Return an ordered set of product images for side-by-side comparison. |
| `highlightVisualDifference` | Return the assets needed to explain visual differences between products. |
| `matchToUserPhoto` | Return catalog candidates that can be compared with a shopper photo. |
| `pickBestFit` | Provide candidate images and preference context for a visual recommendation. |

Vision results are bounded and deterministic. Product IDs are validated, duplicate candidates are removed, and missing images are reported instead of silently substituted. Image bytes, credentials, and uploaded photos are never placed in WebMCP tool schemas.

## Shopper flow

1. Use structured search to narrow the catalog.
2. Request product images only when the question requires visual judgment.
3. Optionally select a local JPG, PNG, or WebP room photo. The browser keeps a temporary object URL until the shopper removes it or leaves the page.
4. Compare the returned references and explain the trade-offs.
5. Add an item to the cart only when the shopper asks. Checkout is never invoked implicitly.

## Technology

- Wasp 0.25 full-stack application
- React, TypeScript, and Vite client
- Node server with Prisma and PostgreSQL
- `use-webmcp-tool` for browser tool registration
- Vitest for contract and behavior tests

This is one application repository. Wasp generates the browser client and Node server from the same specification, allowing the client and server to be deployed independently without maintaining separate codebases.

## Local development

Run the project in the Linux Codespace or another Linux environment with Node 24.14.1 or newer, Wasp 0.25, and Docker.

```bash
npm install --global @wasp.sh/wasp-cli@0.25.0
npm install
wasp doctor
wasp db start
wasp db migrate-dev
wasp start
```

The client runs on port `3000` and the server on port `3001`. In Codespaces, the development proxy keeps browser requests same-origin. Keep `.env` files, database URLs, API keys, and uploaded photos out of Git.

## Verification

From the repository root:

```bash
wasp compile
npm test
```

The browser verification checklist is in [`docs/verification/webmcp-vision.md`](docs/verification/webmcp-vision.md). It covers structured-first tool selection, image retrieval, comparison, photo matching, and the explicit-checkout safety rule.

## Deployment

The client can be deployed to Vercel, the generated Node server to a Wasp-compatible host, and production PostgreSQL to Neon. Build and environment-variable instructions are in [`docs/deployment.md`](docs/deployment.md).

The generated artifacts are:

- Client: `.wasp/out/web-app/build/`
- Server: `.wasp/out/server/bundle/server.js`

Keep local Docker data and production database credentials separate.

## Demo and contribution workflow

The product demo sequence is in [`docs/demo-script.md`](docs/demo-script.md), and the submission copy is in [`devpost-submission.md`](devpost-submission.md).

Create a focused branch from `dev`, run the verification commands, and open a pull request back to `dev`. `main` is reserved for tested releases.

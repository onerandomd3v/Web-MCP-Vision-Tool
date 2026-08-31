# WebMCP Vision Tool

WebMCP Vision Tool is an agent-ready shopping experience for visual product decisions. It combines fast, structured commerce actions with focused product imagery, so an AI agent can answer questions about appearance without relying on full-page screenshots or guesswork.

## Live release

- Client: [webmcp-vision-tool.vercel.app](https://webmcp-vision-tool.vercel.app/)
- API: [webmcp-vision-server-v5-production.up.railway.app](https://webmcp-vision-server-v5-production.up.railway.app/)
- Source: [onerandomd3v/Web-MCP-Vision-Tool](https://github.com/onerandomd3v/Web-MCP-Vision-Tool)

The client and server are deployed from the tested release on `main`. The server uses Neon PostgreSQL for production data.

## The experience

Shoppers can search the catalog, inspect product details, compare specifications, evaluate appearance, and add products to a cart. The application uses two complementary tool layers:

- Structured tools handle discovery, filtering, product details, compatibility, cart actions, coupons, and checkout.
- Vision tools provide bounded product-image references when a request needs a visual judgment about finish, color, shape, or style.

The application supplies product data and image references. A multimodal agent performs the visual interpretation; this project does not pretend to be an image model.

## Vision tools

| Tool | Purpose |
| --- | --- |
| `getProductImage` | Return one product image and its metadata for visual evaluation. |
| `compareProductAesthetics` | Return an ordered set of product images for side-by-side comparison. |
| `highlightVisualDifference` | Return the assets needed to explain visual differences between products. |
| `pickBestFit` | Provide candidate images and preference context for a visual recommendation. |

Vision results are bounded and deterministic. Product IDs are validated, duplicate candidates are removed, and missing images are reported instead of silently substituted. The site returns product image URLs only; the agent's native vision compares them with any photo the user shares directly in chat.

## Shopper flow

1. Use structured search to narrow the catalog.
2. Request product images only when the question requires visual judgment.
3. If visual context is needed, share a photo directly with the agent in chat; the website does not receive personal photos.
4. Compare the returned references and explain the trade-offs.
5. Add an item to the cart only when the shopper asks. Checkout is never invoked implicitly.

## Technology

- React, TypeScript, and Vite client
- Express/Node API with Prisma and PostgreSQL
- `use-webmcp-tool` for browser tool registration
- Vitest for contract and behavior tests

This is one application repository with a React/Vite browser client and an Express/TypeScript API. The two deploy independently without maintaining separate codebases.

## Repository layout

The monorepo keeps the two runtime boundaries visible without duplicating the
project:

| Directory or file | Role |
| --- | --- |
| `src/` | React/Vite frontend, routes, shopping UI, and browser WebMCP tools |
| `server/` | Express/TypeScript backend and API operations |
| `schema.prisma` | Prisma data model for Neon PostgreSQL |
| `migrations/` | Versioned production database migrations |
| `public/` | Frontend product assets |
| `.devcontainer/` | Codespaces development configuration |

The ignored `.wasp/`, `dist/`, and `node_modules/` directories are generated
local output. Wasp is not part of the current runtime or deployment.

See [`docs/architecture.md`](docs/architecture.md) for the request flow and
the reason the frontend source remains under `src/`.

## Local development

Run the project with Node 24.14.1 or newer and a PostgreSQL database.

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build:server
npm run build:client
npm run start:server
```

The client runs on port `3000` and the server on port `3001`. In Codespaces, the development proxy keeps browser requests same-origin. Keep `.env` files, database URLs, and API keys out of Git.

## Verification

From the repository root:

```bash
npm run build:server
npm run build:client
npm test
```

## License

WebMCP Vision Tool is released under the [MIT License](LICENSE).

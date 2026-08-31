# WebMCP Vision Tool architecture

WebMCP Vision Tool is a single repository with two deployable applications. The
frontend and backend are intentionally separate at the source and deployment
boundaries, while sharing one catalog contract and one Prisma schema.

## Repository layout

| Path | Responsibility | Runtime |
| --- | --- | --- |
| `src/` | React/Vite browser application, routes, shopping UI, and WebMCP tool registration | Vercel |
| `server/` | Express API, authentication, catalog operations, and HTTP error handling | Railway |
| `schema.prisma` | Database model shared by server code and migrations | Neon PostgreSQL |
| `migrations/` | Versioned Prisma database migrations applied by Railway | Railway deploy |
| `public/` | Static product assets served by the client | Vercel |
| `.devcontainer/` | Codespaces port-forwarding and workspace metadata | Development only |
| `docs/` | Deployment, verification, demo, and project documentation | Development only |

`src/` is named for the frontend source because Vite is configured at the
repository root. Renaming it to `frontend/` would require changing Vite's root,
TypeScript references, test paths, Vercel output, and Codespaces behavior without
creating a real architectural boundary. The `server/` directory is already the
backend boundary.

## Request flow

1. A browser loads the Vite bundle from Vercel.
2. The client calls the Express API on Railway for catalog, auth, cart, and
   order operations.
3. The browser registers WebMCP tools from `src/webmcp/`.
4. Data-only vision tools return product image URLs. Visual comparison happens
   in the agent's native vision reasoning; the website never receives a user's
   personal photo.
5. The Railway server reads and writes Neon PostgreSQL through Prisma.

## Generated folders

`.wasp/`, `dist/`, and `node_modules/` are generated local output and are not
part of the application source or deployment contract. `.wasp/` was produced by
the earlier Wasp setup; the current project does not depend on Wasp and Git
ignores the folder.

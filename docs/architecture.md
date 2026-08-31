# WebMCP Vision Tool architecture

WebMCP Vision Tool is a single repository with two deployable applications. The
frontend and backend are intentionally separate at the source and deployment
boundaries, while sharing one catalog contract and one Prisma schema.

## Repository layout

| Path | Responsibility | Runtime |
| --- | --- | --- |
| `apps/web/src/` | React/Vite browser application, routes, shopping UI, and WebMCP tool registration | Vercel |
| `apps/backend/server/` | Express API, authentication, catalog operations, and HTTP error handling | Railway |
| `apps/backend/schema.prisma` | Database model shared by server code and migrations | Neon PostgreSQL |
| `apps/backend/migrations/` | Versioned Prisma database migrations applied by Railway | Railway deploy |
| `apps/web/public/` | Static product assets served by the client | Vercel |
| `.devcontainer/` | Codespaces port-forwarding and workspace metadata | Development only |
| `docs/` | Deployment, verification, demo, and project documentation | Development only |

The `apps/web` and `apps/backend` directories form the application boundary.
Frontend source and static assets live together under `apps/web`; the API,
Prisma schema, and migrations live together under `apps/backend`. Root-level
package and deployment configuration remains shared so Vercel and Railway can
build the two applications consistently.

## Request flow

1. A browser loads the Vite bundle from Vercel.
2. The client calls the Express API on Railway for catalog, auth, cart, and
   order operations.
3. The browser registers WebMCP tools from `apps/web/src/webmcp/`.
4. Data-only vision tools return product image URLs. Visual comparison happens
   in the agent's native vision reasoning; the website never receives a user's
   personal photo.
5. The Railway server reads and writes Neon PostgreSQL through Prisma.

## Generated folders

`.wasp/`, `dist/`, and `node_modules/` are generated local output and are not
part of the application source or deployment contract. `.wasp/` was produced by
the earlier Wasp setup; the current project does not depend on Wasp and Git
ignores the folder.

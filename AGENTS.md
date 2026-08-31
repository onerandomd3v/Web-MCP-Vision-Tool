## WebMCP Vision Tool

This project uses a React + Vite TypeScript client and an Express + TypeScript
API. Prisma manages the PostgreSQL schema. Keep the client and server in this
single repository, but build and deploy them as separate services (Vercel and
Railway respectively).

### Verification

- Run `npm run build:client` and `npm run build:server` for production builds.
- Run `npm test` for the Vitest suite.
- Do not commit `.env` files, credentials, database URLs, or user-uploaded media.
- Do not run `tsc` directly for validation.

## WebMCP demo store

This store exposes WebMCP tools in the browser. Prefer them over DOM inspection. When asked to recommend between products, call `get_my_gear` and `check_compatibility` for each candidate, then `highlight_differences` with the spec keys that drove your recommendation, then answer in ≤4 sentences. Never call `checkout` unless explicitly asked.

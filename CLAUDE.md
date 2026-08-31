## WebMCP Vision Tool

This project uses a React + Vite TypeScript client and an Express + TypeScript
API, with Prisma/PostgreSQL persistence. Keep changes in the single repository;
deploy the client to Vercel and the API to Railway.

### Verification

- Run `npm run build:client` and `npm run build:server` for production builds.
- Run `npm test` for the Vitest suite.
- Keep secrets, database URLs, and user-uploaded media out of Git.
- Do not run `tsc` directly for validation.

## WebMCP demo store

This store exposes WebMCP tools in the browser. Prefer them over DOM inspection. When asked to recommend between products, call `get_my_gear` and `check_compatibility` for each candidate, then `highlight_differences` with the spec keys that drove your recommendation, then answer in ≤4 sentences. Never call `checkout` unless explicitly asked.

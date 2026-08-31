# Deployment

WebMCP Vision is one repository containing a React/Vite browser client and an Express/TypeScript API. Deploy the two services separately while keeping one source tree.

## Production configuration

Set these as deployment secrets, never in Git:

- `DATABASE_URL`: Neon Postgres connection string.
- `JWT_SECRET`: random secret of at least 32 characters.
- `WEB_CLIENT_URL`: public client URL.
- `API_URL`: public server URL.
- Any provider credentials required by a future image-storage adapter.

Run production migrations explicitly against the target database after reviewing the migration. Use Prisma's deploy command as a release step, with `DATABASE_URL` pointed at Neon:

```bash
npx prisma migrate deploy
```

## Hosting shape

- Host the Vite client as a static build on Vercel.
- Host the Express Node server on Railway.
- Use Neon for managed Postgres.
- Configure CORS and `WEB_CLIENT_URL` to the exact client origin.

## Current release

- Client: https://webmcp-vision.vercel.app/
- Server: https://webmcp-vision-server-v5-production.up.railway.app/
- Source branch: `dev` (promote releases to `main` through a pull request)

The Railway release applies pending Neon migrations and starts the API on port
`3001`.

## Railway server configuration

The repository includes `railway.toml` for the API service. It builds the
TypeScript server, runs production Prisma migrations, and starts `dist/server/index.js`.
After linking the `dev` branch, set `DATABASE_URL`, `JWT_SECRET`,
`WEB_CLIENT_URL`, and `PORT` as Railway variables, then
trigger a deployment. Keep the client deployment separate and point its API
URL at the Railway service domain.

## Build artifacts

Build the server and create the static client artifact with the API URL supplied at
build time:

```bash
npm run build:server
VITE_API_URL=https://api.example.com npm run build:client
```

The equivalent repository script is `VITE_API_URL=https://api.example.com npm run build:client`.

The client output is `dist/`. Configure Vercel to serve that directory.

Before release, verify catalog reads, authentication, cart actions, image URLs, upload behavior, and all WebMCP registrations against the deployed origin. Do not expose the development database or temporary browser object URLs in production.

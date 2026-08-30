# Deployment

WebMCP Vision is one Wasp repository that produces a browser client and a Node server. Deploy those generated parts separately while keeping one source tree.

## Production configuration

Set these as deployment secrets, never in Git:

- `DATABASE_URL`: Neon Postgres connection string.
- `JWT_SECRET`: random secret of at least 32 characters.
- `WASP_WEB_CLIENT_URL`: public client URL.
- `WASP_SERVER_URL`: public server URL.
- Any provider credentials required by a future image-storage adapter.

Run production migrations explicitly against the target database after reviewing the migration. Use Prisma's deploy command as a release step, with `DATABASE_URL` pointed at Neon:

```bash
npx prisma migrate deploy --schema .wasp/out/db/schema.prisma
```

## Hosting shape

- Host the generated Wasp client as a static Vite build on Vercel.
- Host the generated Wasp Node server on Railway.
- Use Neon for managed Postgres.
- Configure CORS and `WASP_WEB_CLIENT_URL` to the exact client origin.

## Current release

- Client: https://webmcp-vision.vercel.app/
- Server: https://webmcp-vision-server-v5-production.up.railway.app/
- Source branch: `main`

The current Railway release runs the reviewed Wasp build, applies pending
Neon migrations, runs the explicit idempotent `devSeed`, and starts the Node
server on port `3001`.

## Railway server configuration

The repository includes `railway.toml` for the Wasp server service. It tells
Railway to install the pinned Wasp CLI, build the generated application, run
production Prisma migrations, seed the idempotent catalog/demo data, and start
`.wasp/out/server/bundle/server.js`.
After linking the `main` branch, set `DATABASE_URL`, `JWT_SECRET`,
`WASP_SERVER_URL`, and `WASP_WEB_CLIENT_URL` as Railway variables, then
trigger a deployment. Keep the client deployment separate and point its API
URL at the Railway service domain.

## Build artifacts

Wasp generates the deployable source under `.wasp/out/`. Build the application
and then create the static client artifact with the client API URL supplied at
build time:

```bash
wasp build
REACT_APP_API_URL=https://api.example.com npx vite build
```

The equivalent repository script is `REACT_APP_API_URL=https://api.example.com npm run build:client`.

The client output is `.wasp/out/web-app/build/`. Configure the static host's
output directory to that path. The generated server is bundled at
`.wasp/out/server/bundle/server.js` and is run by the generated server package;
deploy it from the generated Dockerfile or the selected Wasp-compatible host.

`wasp build` clears `.wasp/out/`, so do not store hand-edited deployment files
inside that directory. Keep project-level deployment manifests and repeat the
build before each release.

Before release, verify catalog reads, authentication, cart actions, image URLs, upload behavior, and all WebMCP registrations against the deployed origin. Do not expose the development database or temporary browser object URLs in production.

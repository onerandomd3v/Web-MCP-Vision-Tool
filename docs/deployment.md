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
- Host the generated Wasp Node server on Fly or Railway.
- Use Neon for managed Postgres.
- Configure CORS and `WASP_WEB_CLIENT_URL` to the exact client origin.

## Build artifacts

Wasp generates the deployable source under `.wasp/out/`. Build the application
and then create the static client artifact with the client API URL supplied at
build time:

```bash
wasp build
REACT_APP_API_URL=https://api.example.com npx vite build
```

The client output is `.wasp/out/web-app/build/`. Configure the static host's
output directory to that path. The generated server is bundled at
`.wasp/out/server/bundle/server.js` and is run by the generated server package;
deploy it from the generated Dockerfile or the selected Wasp-compatible host.

`wasp build` clears `.wasp/out/`, so do not store hand-edited deployment files
inside that directory. Keep project-level deployment manifests and repeat the
build before each release.

Before release, verify catalog reads, authentication, cart actions, image URLs, upload behavior, and all WebMCP registrations against the deployed origin. Do not expose the development database or temporary browser object URLs in production.

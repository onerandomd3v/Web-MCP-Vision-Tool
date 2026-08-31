# WebMCP Vision Verification

Run the app in the Codespace with the Vite client and Express API, forward port
3000, and open the forwarded client URL. The development Vite config proxies
`/api` to the private API on port 3001. Leave `VITE_API_URL` unset for local
development so requests remain same-origin; never commit environment files or
secrets.

## Environment gate

- Node 24.14.1 or newer is installed and PostgreSQL is reachable.
- `npx prisma migrate deploy` reports the database is in sync.
- `npm run build:client` and `npm run build:server` succeed.
- `npm test` succeeds.

## Recorded Codespace baseline

On 2026-08-30 in the `dev` Codespace, the client returned HTTP 200 on port 3000
and the API returned HTTP 200 on port 3001. Codespaces exposed private HTTPS
forwards for ports 3000 and 3001. This confirms the local client/API path; it
is not a substitute for the public-origin Chrome WebMCP inspection below.

After the same-origin proxy was added, a direct Codespace smoke test on the
development branch returned HTTP 200 for the client and HTTP 200 for
`GET /api/products` through the client origin. This removes the
browser `localhost:3001` failure while keeping the server port private. It is
still a development preview, not a production deployment.

The forwarded client origin was then made temporarily public for an external
check. The client returned HTTP 200, and the same `POST /operations/get-products`
request returned HTTP 200 with a product payload through the public origin.
Codespaces port visibility is temporary and must not be used as the submission
URL; repeat this check after deploying to a permanent host.

## WebMCP checks

1. Enable the Chrome WebMCP flag and open the running client.
2. Confirm the WebMCP badge lists the structured tools and the five vision tools.
3. Ask for a factual product search. Confirm `search_products` is used and no image tool is requested.
4. Ask which two products look best for a minimalist white kitchen. Confirm the agent first discovers products, then calls `getProductImage` or `compareProductAesthetics` for targeted image URLs.
5. Ask for visible differences between two products. Confirm `highlightVisualDifference` is used instead of the spec-based `highlight_differences` tool.
6. Upload a JPG, PNG, or WebP under 8 MB. Confirm the preview appears, `matchToUserPhoto` can return the photo URL plus bounded candidates, and Remove photo revokes the temporary URL.
7. Ask for the best fit among two or three products with a visual preference. Confirm `pickBestFit` returns candidate image references and preference context without claiming that the server performed visual reasoning.
8. Confirm `checkout` is never called unless the user explicitly requests checkout.

## Screenshot fallback comparison

Record the number of tool calls, approximate response time, and whether the model received only product assets for the targeted-image flow. Compare it with a full-page screenshot prompt. The expected result is less page-search work and a smaller visual payload for the targeted flow.

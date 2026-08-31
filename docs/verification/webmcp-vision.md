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

### Public-origin evidence (2026-08-31)

The deployed client at https://webmcp-vision-tool.vercel.app/ returned the
catalog page with 31 products. Its WebMCP inspector listed 7 public tools:
the two structured catalog tools, `compare_products`, and the four vision
tools (`getProductImage`, `compareProductAesthetics`,
`highlightVisualDifference`, and `pickBestFit`).
Account, cart, coupon, and checkout tools remained correctly gated until login.
Direct navigation to `/compare` and `/product/lelit-bianca-v3` also loaded the
React routes successfully after the Vercel history fallback was added. The
product image proxy returned HTTP 200 with `image/jpeg` for the Bianca image.

Live recheck on 2026-08-31 confirmed the same state after the architecture
documentation release: the root client returned HTTP 200, the `/compare` route
rendered its empty-state UI, and the inspector showed `7 of 20 registered`.
The public list contained `search_products`, `get_product_details`,
`getProductImage`, `compareProductAesthetics`, `highlightVisualDifference`,
`pickBestFit`, and `compare_products`. No user-photo upload control,
`matchToUserPhoto` tool, or photo-comparison endpoint was exposed.

1. Enable the Chrome WebMCP flag and open the running client.
2. Confirm the WebMCP badge lists the structured tools and the four vision tools.
3. Ask for a factual product search. Confirm `search_products` is used and no image tool is requested.
4. Ask which two products look best for a minimalist white kitchen. Confirm the agent first discovers products, then calls `getProductImage` or `compareProductAesthetics` for targeted image URLs.
5. Ask for visible differences between two products. Confirm `highlightVisualDifference` is used instead of the spec-based `highlight_differences` tool.
6. Share a photo directly in the agent chat (the website must not receive it), then ask the agent to compare it with product images returned by `getProductImage` or `compareProductAesthetics`.
7. Ask for the best fit among two or three products with a visual preference. Confirm `pickBestFit` returns candidate image references and preference context without claiming that the server performed visual reasoning.
8. Confirm `checkout` is never called unless the user explicitly requests checkout.

## Screenshot fallback comparison

Record the number of tool calls, approximate response time, and whether the model received only product assets for the targeted-image flow. Compare it with a full-page screenshot prompt. The expected result is less page-search work and a smaller visual payload for the targeted flow.

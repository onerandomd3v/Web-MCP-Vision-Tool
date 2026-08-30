# WebMCP Vision Verification

Run the app in the Codespace with `wasp start`, forward ports 3000 and 3001, and open the forwarded client URL. Keep the server URL out of source control; if the client defaults to `localhost:3001`, set `REACT_APP_API_URL` in the local client environment to the forwarded HTTPS URL for port 3001 and restart Wasp.

## Environment gate

- `wasp doctor` reports Wasp 0.25, Node 24.14.1 or newer, Docker running, and free ports.
- `wasp db migrate-dev` reports the database is in sync.
- `wasp compile` succeeds.
- `npm test` succeeds.

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

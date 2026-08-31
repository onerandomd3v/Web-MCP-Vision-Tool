# WebMCP Vision demo script

Target length: two to three minutes.

1. **Set the problem (15 seconds):** “Structured shopping tools are reliable for price, compatibility, and cart actions, but they cannot judge how a product looks in a real space.”
2. **Fast path (25 seconds):** Ask the agent to find two compatible espresso machines. Show that it uses structured search and compatibility tools without loading screenshots or product images.
3. **Visual path (35 seconds):** Ask which option looks better in a minimalist white kitchen. Show the agent requesting targeted product image references and explaining the visible differences.
4. **User context (35 seconds):** Upload a photo of a kitchen counter, call the photo-matching flow, and show the candidates returned alongside the user photo.
5. **Recommendation (25 seconds):** Ask for the best fit with a preference such as “sleek, black, and compact.” Explain that the multimodal model reasons over the supplied assets while WebMCP remains the reliable action layer.
6. **Commerce handoff (20 seconds):** Ask the agent to add the chosen product to the cart. Do not demonstrate checkout unless explicitly requested in the recording.
7. **Close (15 seconds):** “WebMCP Vision keeps routine actions fast and deterministic, and spends visual context only when a visual judgment is necessary.”

Record the browser demo separately from the on-camera introduction so the clips can be edited together cleanly.

## Recording checklist

- Use the permanent live URL: `https://webmcp-vision-tool.vercel.app/`.
- Keep the browser inspector visible when showing tool registration, then hide
  it during ordinary catalog browsing so the product remains the focus.
- Capture the structured search before any visual request. The visual segment
  should show targeted product assets, not a full-page screenshot.
- Use a non-personal sample room image for the upload segment unless the person
  on camera has explicitly agreed to share their own photo.
- Do not click or call checkout in the recording. If demonstrating commerce,
  stop at the optional add-to-cart handoff.

## Critical on-screen text

Keep these strings exact when they appear in captions or title cards:

- `WebMCP Vision`
- `Structured facts first. Targeted vision when it matters.`
- `https://webmcp-vision-tool.vercel.app/`
- `search_products`
- `getProductImage`
- `compareProductAesthetics`
- `matchToUserPhoto`
- `highlightVisualDifference`
- `pickBestFit`
- `No implicit checkout`

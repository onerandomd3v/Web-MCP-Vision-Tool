# WebMCP Vision demo script

Target length: two to three minutes.

1. **Set the problem (15 seconds):** “Structured shopping tools are reliable for price, compatibility, and cart actions, but they cannot judge how a product looks in a real space.”
2. **Fast path (25 seconds):** Ask the agent to find two compatible espresso machines. Show that it uses structured search and compatibility tools without loading screenshots or product images.
3. **Visual path (35 seconds):** Ask which option looks better in a minimalist white kitchen. Show the agent requesting targeted product image references and explaining the visible differences.
4. **User context (35 seconds):** Share a photo of a kitchen counter directly in the agent chat. Ask the agent to compare it with product images returned by the site; no website upload or photo-matching tool is involved.
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
- Share the room image directly in the agent chat; do not upload it through the
  website because the site intentionally has no personal-photo input.
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
- `highlightVisualDifference`
- `pickBestFit`
- `No implicit checkout`

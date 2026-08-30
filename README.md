 # WebMCP Vision Tool

 WebMCP Vision Tool is a vision-assisted shopping experience built for the WebMCP Challenge. It lets an AI agent use reliable commerce actions for routine tasks and request focused product imagery only when a shopper needs a visual answer.

 ## What this project does

 The app helps shoppers discover products, compare specifications, inspect appearance, match products to a room photo, and continue with ordinary cart actions. The experience is deliberately split into two tiers:

 - Structured WebMCP tools handle search, filtering, product details, compatibility, cart, coupons, and checkout.
 - Vision tools return small, targeted image references for visual questions such as finish, color, shape, and style matching.

 The server supplies product data and image references. A multimodal agent performs the visual interpretation; this application does not claim to be an image model.

 ## Vision tools

 | Tool | Purpose |
 | --- | --- |
 | `getProductImage` | Return one product image and its metadata for visual evaluation. |
 | `compareProductAesthetics` | Return a bounded, ordered set of product images for side-by-side comparison. |
 | `highlightVisualDifference` | Return the assets needed to explain visual differences between products. |
 | `matchToUserPhoto` | Return bounded catalog candidates that can be compared with a shopper photo. |
 | `pickBestFit` | Provide candidate images and preference context for a visual recommendation. |

 Every vision result is bounded and deterministic. Product IDs are validated, duplicate candidates are removed, and missing images are reported instead of silently substituted. No image bytes or secrets are placed in WebMCP schemas.

 ## Shopper flow

 1. Use structured search to narrow the catalog.
 2. Ask for product images only when the question requires visual judgment.
 3. Optionally select a local JPG, PNG, or WebP room photo. The browser keeps a temporary object URL until the shopper removes it or leaves the page.
 4. Compare the returned references and explain the trade-offs.
 5. Add an item to the cart only when the shopper asks; checkout is never invoked implicitly.

 ## Technology

 - Wasp 0.25 full-stack application
 - React, TypeScript, and Vite client
 - Node server with Prisma and PostgreSQL
 - `use-webmcp-tool` for browser tool registration
 - Vitest for focused contract tests

 The source is one repository. Wasp generates the browser client and Node server from the same application specification, so the two deployment artifacts can be hosted separately without maintaining separate codebases.

 ## Development

 Use the Linux Codespace or another Linux environment. Node 24.14.1 or newer, Wasp 0.25, and Docker are required.

 ```bash
 npm install --global @wasp.sh/wasp-cli@0.25.0
 wasp doctor
 wasp db start
 wasp db migrate-dev
 wasp start
 ```

 The client runs on port `3000` and the server on port `3001`. Codespaces forwards both ports through [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json). Never commit `.env` files, database URLs, API keys, or uploaded photos.

 ## Verification

 Run the project checks from the repository root:

 ```bash
 wasp compile
 npm test
 ```

 The browser and WebMCP verification checklist is in [`docs/verification/webmcp-vision.md`](docs/verification/webmcp-vision.md). It covers structured-first tool selection, image retrieval, comparison, photo matching, and the explicit-checkout safety rule.

 ## Deployment

 The generated client is intended for Vercel, the generated Node server for a Wasp-compatible host such as Fly, and production PostgreSQL for Neon. Deployment variables and migration steps are documented in [`docs/deployment.md`](docs/deployment.md). Local development uses its own Docker database and must remain separate from production.

 ## Demo and submission

 The recording sequence is documented in [`docs/demo-script.md`](docs/demo-script.md), and the current submission copy is in [`devpost-submission.md`](devpost-submission.md). The final submission still requires a judge-accessible deployment, a public video, and an appropriate open-source license.

 ## Contribution workflow

 Create a focused branch from `dev`, make the change, run the checks above, and open a pull request back to `dev`. `main` is reserved for a tested release. Protected branch rules require review, linear history, resolved conversations, and no force-pushes or branch deletion.

 ## Project foundation and license note

 The project foundation includes the WebMCP Espresso Store starter, whose catalog and commerce behavior are being extended here with the WebMCP Vision Tool experience. The upstream repository currently publishes no license. Before claiming an open-source release, written permission must be obtained or the unlicensed portions must be replaced with code that can be licensed by this project. See [`docs/licensing-blocker.md`](docs/licensing-blocker.md).


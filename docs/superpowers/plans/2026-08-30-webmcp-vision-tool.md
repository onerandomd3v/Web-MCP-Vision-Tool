# WebMCP Vision Tool Implementation Plan

> **For agentic workers:** Implement this plan task-by-task with a fresh verification checkpoint after each task.

**Goal:** Extend the existing Wasp espresso store into a vision-augmented WebMCP shopping experience where structured tools handle routine commerce and targeted image tools support visual judgments.

**Architecture:** Keep the existing Wasp full-stack application and its current structured WebMCP tools. Add a focused vision-tool module that returns product image URLs and user-photo references on demand; the agent’s multimodal model performs the visual reasoning. Add a browser upload flow that stores a temporary user-photo URL without putting image bytes into WebMCP schemas or exposing secrets.

**Tech Stack:** Wasp 0.25, React, TypeScript, Vite, Prisma/Postgres, `use-webmcp-tool`, Vitest, Docker for development, Neon plus a Wasp-compatible server host for deployment.

**Spec:** `C:\Users\HP\Downloads\webmcp-vision-tool-design.md`

## Global Constraints

- Preserve the existing structured commerce tools and their behavior.
- Keep the two-tier model: structured tools are the default; image tools are opt-in for visual questions.
- Return targeted image URLs and metadata, never full-page screenshots by default.
- Do not add raw binary media to WebMCP schemas; use URL references for this implementation.
- Never commit API keys, database credentials, uploaded photos, or `.env` files.
- Run `wasp compile` for Wasp validation; do not use direct `tsc` as the project validation command.
- Work from `dev` on a focused feature branch and merge through a pull request.
- Do not add an open-source license to inherited starter code without upstream permission.

---

### Task 1: Establish the implementation branch and baseline evidence

**Files:**
- Create: no application files; create branch `codex/webmcp-vision-baseline` from `dev`.
- Test: existing project checks through Wasp and Vitest.

**Interfaces:**
- Produces a clean branch and a recorded baseline for later comparisons.

- [x] Confirm the Codespace is on `dev` and the working tree is clean.
- [x] Run `wasp doctor`, `wasp db start`, `wasp db migrate-dev`, and `wasp compile`.
- [x] Run `npm run test` if present, otherwise `npx vitest run` only for test execution (GitHub Actions CI passed `npm test`).
- [x] Start the app with `wasp start`; verify the forwarded client and server ports are reachable.
- [x] Commit no generated artifacts unless already tracked; record any Codespaces URL-routing limitation in the PR notes.

### Task 2: Add the baseline `getProductImage` WebMCP tool

**Files:**
- Modify: `src/webmcp/schemas.ts` to add the exact input schema for `productId`.
- Modify: `src/webmcp/WebMCPTools.tsx` to register `getProductImage` beside the existing product tools.
- Modify: `src/server/queries.ts` only if the existing product query cannot return `id`, `name`, and `imageUrl`.
- Test: add focused tests under `src/webmcp/` for schema validation and missing-product behavior.

**Interfaces:**
- Consumes: existing product lookup/query and the product `imageUrl` field.
- Produces: `{ productId, name, imageUrl }` for a valid product; a structured not-found error for an invalid ID.

- [x] Write tests for valid lookup, missing product, and an image URL that is not leaked when absent.
- [x] Register the tool with a description that explicitly says it is for visual evaluation and is not a general page screenshot.
- [x] Use the existing WebMCP hook and tool-registration conventions; do not create a second registration system.
- [x] Verify that ordinary search and product-detail calls do not include image payloads.
- [x] Run the focused tests and `wasp compile`, then commit `feat: add targeted product image tool`.

### Task 3: Add multi-product visual comparison tools

**Files:**
- Modify: `src/webmcp/schemas.ts` with schemas for `productIds` arrays and bounded array length.
- Modify: `src/webmcp/WebMCPTools.tsx` to register `compareProductAesthetics` and `highlightVisualDifference`.
- Create: `src/webmcp/visionTools.ts` for shared input normalization and result shaping.
- Test: `src/webmcp/visionTools.test.ts`.

**Interfaces:**
- Consumes: product IDs and existing catalog data.
- Produces: ordered `{ id, name, imageUrl }` candidates; visual-difference responses containing both product references and their images, distinct from the existing spec-based `highlight_differences` tool.

- [x] Test duplicate IDs, unknown IDs, empty arrays, and the maximum candidate count.
- [x] Implement stable ordering so the agent can compare products deterministically.
- [x] Keep the existing specification comparison tool unchanged and make the visual tool descriptions clearly distinguish image judgment from specs.
- [x] Run focused tests and `wasp compile` (covered by the passing GitHub Actions CI run); manual WebMCP inspection remains in Task 7.

### Task 4: Build the user-photo upload and `matchToUserPhoto` flow

**Files:**
- Create: `src/vision/UserPhotoPanel.tsx` for file selection, preview, validation, and removal.
- Create: `src/vision/userPhoto.ts` for client-side object URL lifecycle and upload-result typing.
- Modify: `src/App.tsx` or the catalog page to render the panel without disrupting shopping routes.
- Modify: `src/webmcp/schemas.ts` and `src/webmcp/WebMCPTools.tsx` to register `matchToUserPhoto`.
- Create: `src/webmcp/userPhotoTools.test.ts`.

**Interfaces:**
- Consumes: a validated user photo URL and optional product category.
- Produces: `{ userPhoto, candidates }`, where candidates are bounded product image references from the existing catalog.

- [x] Test file type/size rejection, successful preview, cleanup after removal, and no-photo tool errors.
- [x] Start with a temporary browser object URL for the local demo; isolate a future storage adapter so deployment storage can be added without changing the tool contract.
- [x] Add clear consent and removal copy; do not persist or transmit a photo until the user explicitly selects it.
- [x] Limit candidate count and reuse existing catalog filtering rather than duplicating product data.
- [x] Run `wasp compile` and Vitest (covered by the passing GitHub Actions CI run); browser upload smoke test remains in Task 7.

### Task 5: Add the higher-level `pickBestFit` tool and compose the demo flow

**Files:**
- Modify: `src/webmcp/schemas.ts` with bounded `productIds` and `userPreference`.
- Modify: `src/webmcp/WebMCPTools.tsx` to register `pickBestFit`.
- Create: `src/webmcp/demoScenarios.ts` containing deterministic candidate fixtures and prompt examples used by tests/documentation.
- Test: `src/webmcp/demoScenarios.test.ts`.

**Interfaces:**
- Consumes: candidate product IDs plus a natural-language visual preference.
- Produces: candidate image references and a structured recommendation context; it must not claim that the server itself performed visual reasoning.

- [x] Test empty preferences, unknown products, duplicate products, and bounded candidate lists.
- [x] Describe the tool as supplying context to a multimodal agent, not as an image model or an autonomous checkout action.
- [x] Document the intended chain: structured search → image retrieval/comparison → visual recommendation → optional add-to-cart.
- [x] Run all tests and `wasp compile` (covered by the passing GitHub Actions CI run).

### Task 6: Rebrand the experience and make the visual tier discoverable

**Files:**
- Modify: `main.wasp.ts` to use the WebMCP Vision app name/title while preserving Wasp declarations.
- Modify: `src/App.tsx`, `src/catalog/CatalogPage.tsx`, `src/catalog/ProductCard.tsx`, and `src/Main.css` for product-facing copy and visual entry points.
- Modify: `README.md` with final architecture, local setup, tool catalog, and demo script.
- Modify: `public/favicon.ico` or add a new project-owned favicon asset only if the branding asset is available.

**Interfaces:**
- Consumes: completed vision tools and upload panel.
- Produces: a coherent product experience that explains when image tools are used without encouraging screenshots for routine actions.

- [x] Remove remaining Crema/espresso-specific product-facing branding only after the tool flow works.
- [x] Keep factual starter attribution and the unresolved licensing note accurate.
- [x] Add an accessible visual-tools entry point and status/error states for unavailable images.
- [ ] Verify desktop/wide layout first, then responsive behavior; browser smoke tests remain in Task 7 (Wasp compile passes in CI).
- [x] Commit `feat: rebrand WebMCP Vision experience`.

### Task 7: Verify WebMCP behavior and Codespaces routing

**Files:**
- Modify: `.env.client.example` and `.env.server.example` if examples are missing; never commit real values.
- Modify: `README.md` with Codespaces port-forwarding and Chrome WebMCP instructions.
- Test: browser/manual verification checklist kept in `docs/verification/webmcp-vision.md`.

**Interfaces:**
- Consumes: all registered structured and vision tools.
- Produces: evidence that the agent uses structured tools first and requests image references only for visual prompts.

- [ ] Expose/forward ports 3000 and 3001 in Codespaces and configure the client API URL for the forwarded server URL.
- [ ] Enable the Chrome WebMCP testing flag and confirm tools appear in the Model Context Tool Inspector.
- [ ] Test the prompt “Which two machines look better for a minimalist white kitchen?” and confirm image tools are called only after product discovery.
- [ ] Test a spec-only prompt and confirm no image tool is called.
- [ ] Test upload matching, side-by-side comparison, visual difference, and the safety rule that checkout is never called without explicit user instruction.
- [ ] Capture latency/token observations against a full-page screenshot fallback and record them in the verification document.

> Automated verification evidence: GitHub Actions run `33282753946` passed PostgreSQL setup, Wasp 0.25 installation, migrations, `wasp compile`, and `npm test` (20 tests) on Ubuntu with Node 24.14.1.

### Task 8: Prepare deployment, submission, and demo video assets

**Files:**
- Modify: `fly-client.toml` and `fly-server.toml` only where validated deployment settings require it.
- Create: `docs/deployment.md` covering client hosting, Wasp server hosting, Neon, environment variables, and migrations.
- Create: `docs/demo-script.md` with the spoken and on-screen sequence for the product video.
- Modify: `README.md` with live demo, repository, and video links when available.

**Interfaces:**
- Consumes: verified build and tool behavior.
- Produces: a reproducible deployment and a concise Devpost-ready narrative showing WebMCP leverage, creativity, impact, and implementation proof.

- [ ] Configure Neon only through deployment secrets; keep local development DB separate.
- [ ] Deploy the Wasp client and server using the hosting path selected for the project, then run production migrations explicitly.
- [ ] Verify authenticated routes, catalog, image URLs, upload flow, and WebMCP tools against the deployed origin.
- [ ] Record a two-to-three-minute demo: structured search, visual comparison, user-photo match, recommendation rationale, and optional cart action.
- [ ] Prepare Devpost description, architecture explanation, repository link, deployed link, and video; confirm the submission deadline and challenge requirements before submitting.
- [ ] Merge the feature branch into `dev`, then promote the tested release to `main` through the protected PR flow.

## Self-review checklist

- Every vision tool has a bounded schema, deterministic server result, and a focused test.
- The upload flow has explicit user consent, cleanup, and no committed secrets.
- Existing WebMCP commerce tools remain intact and checkout is never called implicitly.
- Local Codespaces routing and deployed client/server URLs are documented separately.
- The README and demo show the tiered pattern rather than presenting this as a new WebMCP protocol.

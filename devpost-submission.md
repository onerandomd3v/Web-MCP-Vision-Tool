# WebMCP Vision

## One-line Summary

An agent-native shopping experience that keeps routine commerce structured and uses targeted product images only when a shopper asks for visual judgment.

## Problem

Shopping agents can reliably search product data, but questions such as “which finish fits my room?” or “which of these looks best in a minimalist kitchen?” require visual context. Sending full-page screenshots is noisy, slow, and makes the agent find the relevant product before it can reason about it.

## Solution

WebMCP Vision exposes two deliberate tool tiers. Structured tools handle catalog discovery, specifications, compatibility, cart actions, and checkout. Five vision tools return only bounded product-image references (and, when explicitly selected, a temporary browser photo URL) so a multimodal agent can make a visual judgment without pretending the server is an image model.

## Why This Matters

People and agents can collaborate on a decision that was previously difficult to express through structured product data alone: a person supplies a style or space, while the agent compares the relevant visual candidates and explains visible trade-offs. Routine actions remain fast and deterministic, and visual context is spent only when it is useful.

## How We Used AI

The multimodal agent performs the visual reasoning over the targeted URLs returned by `getProductImage`, `compareProductAesthetics`, `highlightVisualDifference`, `matchToUserPhoto`, and `pickBestFit`. WebMCP remains the action and data contract; the server returns deterministic references and never claims to classify an image itself.

## How We Used Codex

Codex helped inspect the Wasp starter, preserve the existing commerce tools, design bounded schemas, implement the React upload flow, write focused Vitest coverage, configure Wasp/Postgres CI, debug Codespaces routing and generated dependencies, and prepare the verification and demo documentation. Changes were developed on feature branches and merged into protected `dev` through pull requests.

## Key Features

- Structured product search and details remain the default path.
- Targeted image retrieval and deterministic 2–3 product visual comparisons.
- User-photo preview, replacement, removal, type/size validation, and session-only object URLs.
- Preference-based best-fit context for a multimodal agent.
- Explicit checkout guard: checkout is never called without a direct user request.
- Accessible visual entry point and documented Codespaces setup.

## Architecture

One Wasp 0.25 source repository generates a React/Vite client and Node server. Existing catalog and commerce operations remain in Wasp/Prisma/Postgres. `src/webmcp/` owns tool schemas and deterministic result shaping; `src/vision/` owns the temporary browser photo lifecycle. The intended release topology is a Vercel client, a Wasp-compatible Node host, and Neon Postgres.

## Testing Instructions

The authoritative local flow is in [`docs/verification/webmcp-vision.md`](docs/verification/webmcp-vision.md). In a Linux or Codespaces terminal with Node 24.14.1, Wasp 0.25, and Docker available:

```bash
npm install --global @wasp.sh/wasp-cli@0.25.0
wasp doctor
wasp db start
wasp db migrate-dev
npm test
wasp compile
wasp start
```

For browser testing, forward ports 3000 and 3001, set the forwarded API URL as described in the README, enable Chrome WebMCP testing, and test structured search before visual prompts. No production credentials are included.

## Public Demo Link

https://webmcp-vision.vercel.app/

The React client is deployed on Vercel. Its Wasp server runs on Railway and uses Neon PostgreSQL:
https://webmcp-vision-server-v5-production.up.railway.app/

## Public Repository Link

https://github.com/onerandomd3v/Web-MCP-Vision-Tool

## Devpost Project Draft

https://devpost.com/software/webmcp-vision

The project page is published as a draft for The WebMCP Challenge. It is not
submitted yet; the public license and demonstration video must be completed
before final submission.

## Demo Video

TODO: record and publish a public YouTube video under three minutes. The shot-by-shot outline is in [`docs/demo-script.md`](docs/demo-script.md).

## Screenshot Shot List

1. Catalog page showing the “Shop by how it looks” photo panel.
2. WebMCP tool inspector showing structured tools and the five vision tools.
3. Structured product search followed by targeted image retrieval.
4. Side-by-side visual comparison and recommendation rationale.
5. Photo-match preview with the remove-photo control visible.

## Submission Readiness Notes

- Code, tests, Wasp compile, and CI are currently passing in Codespaces.
- The repository is public and contains the WebMCP implementation and run instructions.
- The live client and server are deployed and verified; the public client loads the catalog and registers the structured and vision tools.
- Browser screenshots and the YouTube demo video remain to be captured and published.
- The challenge requires a detectable open-source license. The inherited starter has no license, so adding one requires upstream permission or replacement of the unlicensed starter code before submission.
- The official form requires selecting submitter type, country, app status, live URL, public repo URL, tested agent/client, AI tools used, learning level, and AI career value.

## Known Limitations

- User photos currently use browser object URLs and are not persisted or uploaded to a storage provider.
- The deployed public origin was checked in the WebMCP inspector: structured
  catalog tools and all five vision tools were listed; account-only commerce
  tools remained gated until login.
- Production deployment and the initial Neon migration have been completed; future schema changes still require an explicit production migration.
- The starter’s catalog remains espresso-oriented even though the product experience is branded WebMCP Vision.

## TODO Official Form Fields

- Submitter Type: choose the truthful Devpost value.
- Country of residence: choose the truthful value(s).
- App Status: likely `Existing`; explain the WebMCP extension made during the submission period.
- Live URL: `https://webmcp-vision.vercel.app/`.
- Public code repository: `https://github.com/onerandomd3v/Web-MCP-Vision-Tool`.
- Tested agent/client: ChatGPT in-app browser; the public catalog route and WebMCP registration were verified.
- AI tools leveraged: describe the multimodal agent and Codex accurately.
- Learning level: choose the truthful value.
- AI career value: choose the truthful value.

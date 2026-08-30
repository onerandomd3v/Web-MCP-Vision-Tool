# WebMCP Vision

WebMCP Vision is an agent-native shopping experience that combines reliable, structured WebMCP actions with on-demand visual reasoning.

Instead of asking an agent to navigate a page by screenshots and guesswork, the app exposes intentional tools for search, comparison, cart actions, and product data. When a request genuinely needs a visual opinion, the agent can retrieve only the relevant product assets and evaluate them with a vision-capable model.

## The problem

Structured product data can answer questions about price, materials, compatibility, and stock. It cannot answer questions such as:

- Which option looks best in a minimalist kitchen?
- Which finish matches the room in this photo?
- What visual differences matter between these two products?

Full-page screenshots are a poor default for those moments: they are slower, more token-intensive, and force an agent to locate the relevant object before it can reason about it.

## The approach

WebMCP Vision uses two tool tiers:

1. **Structured action tools** handle the fast path: discovery, filtering, specifications, cart actions, and checkout.
2. **Vision access tools** return targeted product image references only when a user asks for a visual judgment.

That separation keeps routine interactions fast and dependable while giving an agent the context it needs for subjective visual decisions.

## Planned experience

The first version will help a shopper move from an intent such as “find something sleek and black that works in my space” to a grounded recommendation:

1. The agent narrows candidates with structured product information.
2. When visual judgment is needed, it requests only the relevant images.
3. For room or style matching, the shopper can upload a photo of their own space.
4. The agent compares the photo and candidate products, explains the visual trade-offs, and can continue with supported shopping actions.

## WebMCP vision tools

| Tool | Purpose |
| --- | --- |
| `getProductImage` | Retrieve one product image for direct visual evaluation. |
| `compareProductAesthetics` | Retrieve a focused set of product images for side-by-side comparison. |
| `matchToUserPhoto` | Return category candidates that can be compared against a shopper-uploaded photo. |
| `highlightVisualDifference` | Provide the assets needed to explain visual differences such as finish, color, or form. |
| `pickBestFit` | Support a visual recommendation using a shopper’s stated aesthetic preference. |

The vision tools return focused image references and context. Visual reasoning is performed by the agent's multimodal model; the server does not pretend to be an image model. Existing structured tools remain the default for search, specifications, compatibility, cart, coupons, and checkout.

## Local development

Use the Linux Codespace or another Linux environment for Wasp:

```bash
npm install --global @wasp.sh/wasp-cli@0.25.0
wasp doctor
wasp db start
wasp db migrate-dev
wasp start
```

The client normally runs on port 3000 and the server on port 3001. In Codespaces, forward both ports. If the forwarded client still calls `localhost:3001`, set `REACT_APP_API_URL` in a local `.env.client` file to the forwarded HTTPS address for port 3001, then restart Wasp. Never commit environment files or secrets.

## Verification and deployment

The complete WebMCP test checklist is in [`docs/verification/webmcp-vision.md`](docs/verification/webmcp-vision.md). Production deployment guidance for a Vercel client, Wasp server host, and Neon Postgres is in [`docs/deployment.md`](docs/deployment.md). The planned recording sequence is in [`docs/demo-script.md`](docs/demo-script.md).

## Development direction

This project is being built for the WebMCP Challenge. The work will focus on:

- meaningful WebMCP integration, rather than browser automation disguised as tools;
- a real user-photo upload flow for visual matching;
- clear, targeted image access instead of broad page screenshots;
- an observable, testable demonstration of the structured and vision-assisted paths; and
- a deployment, public repository, and documentation that let reviewers understand and test the experience.

## Repository workflow

`dev` is the protected integration branch. Create a feature branch from `dev`, open a pull request back into `dev`, and use `main` only for production-ready releases. Both branches require a pull request review, linear history, resolved review threads, and reject force-pushes and deletions.

## Starter attribution

This repository began from the [webmcp-espresso-store](https://github.com/vincanger/webmcp-espresso-store) starter. WebMCP Vision is being developed as a distinct project and will document its own implementation work clearly.

## Status

The first vision tool layer, browser photo panel, deterministic demo scenarios, and automated Wasp/Postgres CI are implemented on the feature branch. The remaining gate is live WebMCP verification in Chrome, followed by deployment and the recorded demo.

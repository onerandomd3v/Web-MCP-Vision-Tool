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

## Planned WebMCP tools

| Tool | Purpose |
| --- | --- |
| `getProductImage` | Retrieve one product image for direct visual evaluation. |
| `compareProductAesthetics` | Retrieve a focused set of product images for side-by-side comparison. |
| `matchToUserPhoto` | Return category candidates that can be compared against a shopper-uploaded photo. |
| `highlightVisualDifference` | Provide the assets needed to explain visual differences such as finish, color, or form. |
| `pickBestFit` | Support a visual recommendation using a shopper’s stated aesthetic preference. |

These are planned capabilities. The current repository is the implementation starting point, not a claim that every tool is already available.

## Development direction

This project is being built for the WebMCP Challenge. The work will focus on:

- meaningful WebMCP integration, rather than browser automation disguised as tools;
- a real user-photo upload flow for visual matching;
- clear, targeted image access instead of broad page screenshots;
- an observable, testable demonstration of the structured and vision-assisted paths; and
- a deployment, public repository, and documentation that let reviewers understand and test the experience.

## Repository workflow

`dev` is the integration branch. Create a feature branch from `dev`, open a pull request back into `dev`, and use `main` only for production-ready releases.

## Starter attribution

This repository began from the [webmcp-espresso-store](https://github.com/vincanger/webmcp-espresso-store) starter. WebMCP Vision is being developed as a distinct project and will document its own implementation work clearly.

## Status

Concept and implementation plan complete. Development is beginning with the WebMCP Vision tool layer and the visual-matching experience.

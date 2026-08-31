# WebMCP Vision Tool submission checklist

Use this checklist for the final release and Devpost submission.

## Deadline

The WebMCP Challenge submission deadline is **September 3, 2026 at 1:00 PM Pacific Time**. Treat that as the hard cutoff for the live app, repository, submission form, and demo video.

## Before submitting

- [x] Merge the final tested changes into `dev`, then promote the same commit to `main` through the protected pull request flow.
- [x] Confirm the repository is public and the final commit is visible on the submitted branch.
- [x] Confirm the repository contains a visible MIT open-source license.
- [x] Deploy the client and server to permanent public URLs.
- [x] Run the production database migration explicitly against the production database.
- [x] Open the public URL in ChatGPT's in-app browser or Chrome with WebMCP testing enabled.
- [x] Confirm the catalog loads and the public routes behave as expected.
- [x] Confirm the WebMCP inspector lists the structured tools and five vision tools.

Verified production client: https://webmcp-vision-tool.vercel.app/.

The inspector check was completed against the deployed public origin on August
31, 2026. It showed the structured catalog tools and the five vision tools;
authentication, cart, coupon, and checkout tools remained gated until login.

- [ ] Verify a factual search uses structured tools without requesting images.
- [ ] Verify visual comparison, difference highlighting, photo matching, and best-fit recommendation work from the public origin.
- [ ] Confirm checkout is never called without an explicit request.

## Video

Record a public YouTube demo shorter than three minutes, with clear audio. Show:

1. The problem: structured product data cannot answer appearance questions.
2. Structured product discovery without screenshots.
3. Targeted image retrieval and side-by-side visual comparison.
4. A user photo and the matching flow.
5. A preference-based recommendation with its rationale.
6. An optional add-to-cart handoff, without implicit checkout.

Add the video URL and the permanent live URL to `devpost-submission.md` before submitting.

## Submission freeze

After submitting, do not modify the Devpost entry, submitted repository, or live site during judging unless the organizers explicitly permit it. If development must continue, create a separate branch or copy and leave the submitted release unchanged.

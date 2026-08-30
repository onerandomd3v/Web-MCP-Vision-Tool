import type { ProductImageResult } from "./visionTools";

export type VisionDemoScenario = {
  id: string;
  prompt: string;
  candidateIds: string[];
  expectedVisualTool: "compareProductAesthetics" | "highlightVisualDifference" | "pickBestFit";
};

/** Stable prompts used by the demo script and manual WebMCP verification. */
export const visionDemoScenarios: VisionDemoScenario[] = [
  {
    id: "minimalist-kitchen",
    prompt: "Which two machines look better for a minimalist white kitchen?",
    candidateIds: ["minimal-machine", "compact-machine"],
    expectedVisualTool: "compareProductAesthetics",
  },
  {
    id: "finish-difference",
    prompt: "What visible differences matter between these two finishes?",
    candidateIds: ["minimal-machine", "classic-machine"],
    expectedVisualTool: "highlightVisualDifference",
  },
  {
    id: "sleek-black-fit",
    prompt: "Pick the best fit if I want something sleek, black, and compact.",
    candidateIds: ["compact-machine", "classic-machine"],
    expectedVisualTool: "pickBestFit",
  },
];

export function buildScenarioContext(
  scenario: VisionDemoScenario,
  candidates: ProductImageResult[],
) {
  const byId = new Map(candidates.map((candidate) => [candidate.productId, candidate]));
  return {
    ...scenario,
    candidates: scenario.candidateIds.flatMap((candidateId) => {
      const candidate = byId.get(candidateId);
      return candidate ? [candidate] : [];
    }),
  };
}

import { describe, expect, it } from "vitest";
import { buildScenarioContext, visionDemoScenarios } from "./demoScenarios";

describe("vision demo scenarios", () => {
  it("keeps deterministic prompts and bounded candidate lists", () => {
    expect(visionDemoScenarios).toHaveLength(3);
    expect(visionDemoScenarios.every(({ candidateIds }) => candidateIds.length >= 2 && candidateIds.length <= 3)).toBe(true);
    expect(new Set(visionDemoScenarios.map(({ id }) => id)).size).toBe(3);
  });

  it("preserves scenario order while selecting supplied image references", () => {
    const scenario = visionDemoScenarios[0];
    const context = buildScenarioContext(scenario, [
      { productId: "compact-machine", name: "Compact", imageUrl: "https://example.com/c.jpg" },
      { productId: "minimal-machine", name: "Minimal", imageUrl: "https://example.com/m.jpg" },
      { productId: "ignored", name: "Ignored", imageUrl: "https://example.com/i.jpg" },
    ]);

    expect(context.candidates.map(({ productId }) => productId)).toEqual(["minimal-machine", "compact-machine"]);
    expect(context.expectedVisualTool).toBe("compareProductAesthetics");
  });
});

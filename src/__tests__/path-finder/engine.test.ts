import { describe, it, expect } from "vitest";
import { pathFinderDefinition } from "@/lib/games/path-finder/engine";
import { PracticeConfig, GameAction } from "@/lib/games/core/types";
import { PathFinderActionPayload } from "@/lib/games/path-finder/types";
import { SessionController } from "@/lib/games/core/session";

describe("Path Finder — Engine Definition & Session Lifecycle Suite", () => {
  const dummyConfig: PracticeConfig = {
    gameId: "path-finder",
    variantId: "default",
    difficulty: "EASY",
    mode: "TIMED_PRACTICE",
    itemCount: 3,
    timeLimitSeconds: 240,
    instructionTimeSeconds: 0,
    scoringConfig: { mode: "TIMED_PRACTICE", weights: { accuracy: 1, speed: 0, completion: 0 } },
    allowRestart: false,
    allowBacktrack: false,
  };

  it("creates valid initial state with questions", () => {
    const state = pathFinderDefinition.createInitialState(dummyConfig, "seed-pf-engine");
    expect(state.questions.length).toBe(3);
    expect(state.currentQuestionIndex).toBe(0);
  });

  it("validates correct user action when rotations match solution", () => {
    const state = pathFinderDefinition.createInitialState(dummyConfig, "seed-pf-engine-2");
    const q = state.questions[0];

    const action: GameAction<PathFinderActionPayload> = {
      timestamp: Date.now(),
      type: "ACTION",
      itemIndex: 0,
      responseTimeMs: 2500,
      valid: false,
      payload: {
        rotations: q.solutionRotations,
        direction: "FORWARD",
        isTimeout: false,
      },
    };

    expect(pathFinderDefinition.validateAction(state, action)).toBe(true);
  });

  it("rejects action on timeout", () => {
    const state = pathFinderDefinition.createInitialState(dummyConfig, "seed-pf-engine-3");
    const q = state.questions[0];

    const action: GameAction<PathFinderActionPayload> = {
      timestamp: Date.now(),
      type: "ACTION",
      itemIndex: 0,
      responseTimeMs: 240000,
      valid: false,
      payload: {
        rotations: q.solutionRotations,
        direction: "FORWARD",
        isTimeout: true,
      },
    };

    expect(pathFinderDefinition.validateAction(state, action)).toBe(false);
  });

  it("completes session cleanly through 3 questions without throwing", () => {
    const controller = new SessionController(
      "session-pf-lifecycle",
      dummyConfig,
      pathFinderDefinition,
      "seed-pf-lifecycle"
    );

    controller.transitionTo("READY");
    controller.transitionTo("PLAYING");

    const sessionState = controller.getSession().gameState as { questions: { solutionRotations: number[][] }[] };

    // Question 1
    controller.recordAction(
      {
        rotations: sessionState.questions[0].solutionRotations,
        direction: "FORWARD",
        isTimeout: false,
      },
      1200
    );
    controller.advanceItem();
    expect(controller.getSession().status).toBe("PLAYING");
    expect(controller.getSession().currentItemIndex).toBe(1);

    // Question 2
    controller.recordAction(
      {
        rotations: sessionState.questions[1].solutionRotations,
        direction: "FORWARD",
        isTimeout: false,
      },
      1400
    );
    controller.advanceItem();
    expect(controller.getSession().status).toBe("PLAYING");
    expect(controller.getSession().currentItemIndex).toBe(2);

    // Question 3 (Final question)
    controller.recordAction(
      {
        rotations: sessionState.questions[2].solutionRotations,
        direction: "FORWARD",
        isTimeout: false,
      },
      1600
    );
    // Session is now COMPLETED
    expect(controller.getSession().status).toBe("COMPLETED");

    // advanceItem on completed session should safely no-op without throwing
    expect(() => controller.advanceItem()).not.toThrow();
    expect(controller.getSession().status).toBe("COMPLETED");
  });

  it("handles timer expiry during animation: transition to TIMEOUT prevents stale advanceItem", () => {
    const controller = new SessionController(
      "session-pf-timeout-race",
      dummyConfig,
      pathFinderDefinition,
      "seed-pf-timeout-race"
    );

    controller.transitionTo("READY");
    controller.transitionTo("PLAYING");

    const sessionState = controller.getSession().gameState as { questions: { solutionRotations: number[][] }[] };

    // 1. User submits valid answer
    controller.recordAction(
      {
        rotations: sessionState.questions[0].solutionRotations,
        direction: "FORWARD",
        isTimeout: false,
      },
      1500
    );

    // 2. Global assessment timer expires during animation -> transitions session to TIMEOUT
    controller.transitionTo("TIMEOUT");
    expect(controller.getSession().status).toBe("TIMEOUT");

    // 3. Stale delayed animation callback fires advanceItem() -> must safe no-op
    expect(() => controller.advanceItem()).not.toThrow();
    expect(controller.getSession().status).toBe("TIMEOUT");
    expect(controller.getSession().currentItemIndex).toBe(0); // Did not corrupt or advance
  });
});

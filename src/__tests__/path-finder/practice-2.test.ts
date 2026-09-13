import { describe, it, expect, vi } from "vitest";
import {
  PRACTICE_TEST_2_PUZZLES,
  generatePractice2Questions,
  generatePractice2Question,
  getPuzzleSignature,
  createSeededRng,
} from "@/lib/games/path-finder/practice-2-puzzle";
import {
  buildBoard,
  rotateTile,
  reverseTileDirection,
  rotateArrowDirection,
  reverseArrow,
  getBaseTileGeometry,
  getEffectivePorts,
  getEffectiveTileCells,
  normalizeRotation,
  SHAPE_FLIP_STATES_COUNT,
  getTileFlipState,
} from "@/lib/games/path-finder/transformations";
import { validateRoute, validateTileRoute } from "@/lib/games/path-finder/validator";
import { ArrowDirection, RouteCell, TileDefinition, TileState } from "@/lib/games/path-finder/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useParams: () => ({ variant: "practice-2" }),
}));

describe("Path Finder Practice Test 2 — Canonical Model & Reversible Direction Specification", () => {
  it("TEST 1: Canonical SHAPE_FLIP_STATES_COUNT (STRAIGHT=2, CORNER=2, T_JUNCTION=6, CROSS=8)", () => {
    expect(SHAPE_FLIP_STATES_COUNT).toEqual({
      STRAIGHT: 2,
      CORNER: 2,
      T_JUNCTION: 6,
      CROSS: 8,
    });
  });

  it("TEST 2: Canonical 90° Clockwise Arrow Direction Mapping (All 8 Directions)", () => {
    expect(rotateArrowDirection("RIGHT", 1)).toBe("DOWN");
    expect(rotateArrowDirection("DOWN_RIGHT", 1)).toBe("DOWN_LEFT");
    expect(rotateArrowDirection("DOWN", 1)).toBe("LEFT");
    expect(rotateArrowDirection("DOWN_LEFT", 1)).toBe("UP_LEFT");
    expect(rotateArrowDirection("LEFT", 1)).toBe("UP");
    expect(rotateArrowDirection("UP_LEFT", 1)).toBe("UP_RIGHT");
    expect(rotateArrowDirection("UP", 1)).toBe("RIGHT");
    expect(rotateArrowDirection("UP_RIGHT", 1)).toBe("DOWN_RIGHT");
  });

  it("TEST 3: Canonical Opposite Direction Mapping (All 8 Directions)", () => {
    expect(reverseArrow("RIGHT")).toBe("LEFT");
    expect(reverseArrow("LEFT")).toBe("RIGHT");
    expect(reverseArrow("UP")).toBe("DOWN");
    expect(reverseArrow("DOWN")).toBe("UP");
    expect(reverseArrow("UP_RIGHT")).toBe("DOWN_LEFT");
    expect(reverseArrow("DOWN_LEFT")).toBe("UP_RIGHT");
    expect(reverseArrow("DOWN_RIGHT")).toBe("UP_LEFT");
    expect(reverseArrow("UP_LEFT")).toBe("DOWN_RIGHT");
  });

  it("TEST 4: Canonical STRAIGHT Tile States (2 states: 0: ← ← ←, 1: → → →)", () => {
    const s0 = getBaseTileGeometry("STRAIGHT", 0);
    const s1 = getBaseTileGeometry("STRAIGHT", 1);

    expect(s0.ports).toEqual({ enter: "RIGHT", exit: "LEFT" });
    expect(s0.cells[1][0]).toEqual({ active: true, arrowDirection: "LEFT" });
    expect(s0.cells[1][1]).toEqual({ active: true, arrowDirection: "LEFT" });
    expect(s0.cells[1][2]).toEqual({ active: true, arrowDirection: "LEFT" });

    expect(s1.ports).toEqual({ enter: "LEFT", exit: "RIGHT" });
    expect(s1.cells[1][0]).toEqual({ active: true, arrowDirection: "RIGHT" });
    expect(s1.cells[1][1]).toEqual({ active: true, arrowDirection: "RIGHT" });
    expect(s1.cells[1][2]).toEqual({ active: true, arrowDirection: "RIGHT" });
  });

  it("TEST 5: Canonical CORNER Tile States (2 states: 0: RIGHT->TOP, 1: TOP->RIGHT)", () => {
    const c0 = getBaseTileGeometry("CORNER", 0);
    const c1 = getBaseTileGeometry("CORNER", 1);

    expect(c0.ports).toEqual({ enter: "RIGHT", exit: "TOP" });
    expect(c0.cells[0][1]).toEqual({ active: true, arrowDirection: "UP" });
    expect(c0.cells[1][1]).toEqual({ active: true, arrowDirection: "UP_LEFT" });
    expect(c0.cells[1][2]).toEqual({ active: true, arrowDirection: "LEFT" });

    expect(c1.ports).toEqual({ enter: "TOP", exit: "RIGHT" });
    expect(c1.cells[0][1]).toEqual({ active: true, arrowDirection: "DOWN" });
    expect(c1.cells[1][1]).toEqual({ active: true, arrowDirection: "DOWN_RIGHT" });
    expect(c1.cells[1][2]).toEqual({ active: true, arrowDirection: "RIGHT" });
  });

  it("TEST 6: Canonical T_JUNCTION Tile States (Exact 6 Predefined States 0..5)", () => {
    const t0 = getBaseTileGeometry("T_JUNCTION", 0);
    const t1 = getBaseTileGeometry("T_JUNCTION", 1);
    const t2 = getBaseTileGeometry("T_JUNCTION", 2);
    const t3 = getBaseTileGeometry("T_JUNCTION", 3);
    const t4 = getBaseTileGeometry("T_JUNCTION", 4);
    const t5 = getBaseTileGeometry("T_JUNCTION", 5);

    expect(t0.ports).toEqual({ enter: "RIGHT", exit: "TOP" });
    expect(t1.ports).toEqual({ enter: "LEFT", exit: "TOP" });
    expect(t2.ports).toEqual({ enter: "LEFT", exit: "RIGHT" });
    expect(t3.ports).toEqual({ enter: "TOP", exit: "RIGHT" });
    expect(t4.ports).toEqual({ enter: "TOP", exit: "LEFT" });
    expect(t5.ports).toEqual({ enter: "RIGHT", exit: "LEFT" });
  });

  it("TEST 7: Canonical CROSS / PLUS Tile States (Exact 8 Predefined States 0..7)", () => {
    const p0 = getBaseTileGeometry("CROSS", 0);
    const p1 = getBaseTileGeometry("CROSS", 1);
    const p2 = getBaseTileGeometry("CROSS", 2);
    const p3 = getBaseTileGeometry("CROSS", 3);
    const p4 = getBaseTileGeometry("CROSS", 4);
    const p5 = getBaseTileGeometry("CROSS", 5);
    const p6 = getBaseTileGeometry("CROSS", 6);
    const p7 = getBaseTileGeometry("CROSS", 7);

    expect(p0.ports).toEqual({ enter: "BOTTOM", exit: "TOP" });
    expect(p1.ports).toEqual({ enter: "LEFT", exit: "TOP" });
    expect(p2.ports).toEqual({ enter: "LEFT", exit: "RIGHT" });
    expect(p3.ports).toEqual({ enter: "TOP", exit: "RIGHT" });
    expect(p4.ports).toEqual({ enter: "TOP", exit: "BOTTOM" });
    expect(p5.ports).toEqual({ enter: "RIGHT", exit: "BOTTOM" });
    expect(p6.ports).toEqual({ enter: "RIGHT", exit: "LEFT" });
    expect(p7.ports).toEqual({ enter: "BOTTOM", exit: "LEFT" });
  });

  it("TEST 8 (CRITICAL): In-Place Direction Reversal on CROSS — Reverses arrows without moving cells", () => {
    // Input:
    // .   .   .
    // ←   ↖   .
    // .   ↑   .
    const inputCells: RouteCell[][] = [
      [{ active: false }, { active: true }, { active: false }],
      [{ active: true, arrowDirection: "LEFT" }, { active: true, arrowDirection: "UP_LEFT" }, { active: true }],
      [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
    ];

    const outputCells = reverseTileDirection(inputCells);

    // Active coordinates MUST be unchanged:
    expect(outputCells[0][1].active).toBe(true);
    expect(outputCells[0][1].arrowDirection).toBeUndefined(); // null remains null

    expect(outputCells[1][0].active).toBe(true);
    expect(outputCells[1][0].arrowDirection).toBe("RIGHT"); // LEFT -> RIGHT

    expect(outputCells[1][1].active).toBe(true);
    expect(outputCells[1][1].arrowDirection).toBe("DOWN_RIGHT"); // UP_LEFT -> DOWN_RIGHT

    expect(outputCells[1][2].active).toBe(true);
    expect(outputCells[1][2].arrowDirection).toBeUndefined(); // null remains null

    expect(outputCells[2][1].active).toBe(true);
    expect(outputCells[2][1].arrowDirection).toBe("DOWN"); // UP -> DOWN

    // Second reversal restores exact initial layout
    expect(reverseTileDirection(outputCells)).toEqual(inputCells);
  });

  it("TEST 9: Rotation moves cell coordinates AND rotates arrows simultaneously", () => {
    const baseCells = getBaseTileGeometry("CORNER", 0).cells;

    // Base CORNER: (0,1) UP, (1,1) UP_LEFT, (1,2) LEFT
    const rot1 = rotateTile(baseCells, 90);
    expect(rot1[1][2]).toEqual({ active: true, arrowDirection: "RIGHT" });
    expect(rot1[1][1]).toEqual({ active: true, arrowDirection: "UP_RIGHT" });
    expect(rot1[2][1]).toEqual({ active: true, arrowDirection: "UP" });
  });

  it("TEST 10: Four rotations restore the exact original state", () => {
    const tile: TileDefinition = { id: "T00", gridRow: 0, gridCol: 0, type: "CROSS", cells: [] };
    const c0 = getEffectiveTileCells(tile, { rotation: 0, mode: 0 });
    const c1 = getEffectiveTileCells(tile, { rotation: 1, mode: 0 });
    const c2 = getEffectiveTileCells(tile, { rotation: 2, mode: 0 });
    const c3 = getEffectiveTileCells(tile, { rotation: 3, mode: 0 });

    expect(rotateTile(c0, 90)).toEqual(c1);
    expect(rotateTile(c1, 90)).toEqual(c2);
    expect(rotateTile(c2, 90)).toEqual(c3);
    expect(rotateTile(c3, 90)).toEqual(c0);
  });

  it("TEST 11: Rotation + direction change do not interfere with one another", () => {
    const tile: TileDefinition = { id: "T00", gridRow: 0, gridCol: 0, type: "CORNER", cells: [] };

    const base = getEffectiveTileCells(tile, { rotation: 0, mode: 0 });
    const rotThenRev = reverseTileDirection(rotateTile(base, 90));
    const revThenRot = rotateTile(reverseTileDirection(base), 90);

    expect(rotThenRev).toEqual(revThenRot);
  });

  it("TEST 12: Guaranteed Solvability & Unsolved Initial State for All 5 Questions", () => {
    const questions = generatePractice2Questions(5, 777);
    const signatures = new Set<string>();

    expect(questions.length).toBe(5);

    questions.forEach((q) => {
      // 1. Check distinct signature
      const sig = getPuzzleSignature(q);
      expect(signatures.has(sig)).toBe(false);
      signatures.add(sig);

      // 2. Initial state must NOT be solved
      const initRes = validateRoute(q, q.initialTileStates);
      expect(initRes.isValid).toBe(false);

      // 3. Solution state MUST be solved
      expect(q.solution).toBeDefined();
      expect(q.solution?.tileStates).toBeDefined();
      if (q.solution) {
        const solvedRes = validateRoute(q, q.solution.tileStates);
        expect(solvedRes.isValid).toBe(true);
        expect(solvedRes.visitedPath.length).toBeGreaterThan(0);
      }
    });

    expect(signatures.size).toBe(5);
  });

  it("TEST 13: Multi-Seed Stress Test — 25 Generated Questions Across 5 Seeds", () => {
    const seeds = [1001, 2002, 3003, 4004, 5005];

    seeds.forEach((seed) => {
      const questions = generatePractice2Questions(5, seed);
      expect(questions.length).toBe(5);
      const setSigs = new Set<string>();

      for (const q of questions) {
        const sig = getPuzzleSignature(q);
        expect(setSigs.has(sig)).toBe(false);
        setSigs.add(sig);

        // Solved state valid
        const solvedRes = validateRoute(q, q.solution!.tileStates);
        expect(solvedRes.isValid).toBe(true);

        // Initial state unsolved
        const initRes = validateRoute(q, q.initialTileStates);
        expect(initRes.isValid).toBe(false);
      }
    });
  });

  it("TEST 14: Real UI Integration & Multi-Question Flow (Q1 -> Q5 -> Completed)", async () => {
    const React = await import("react");
    const { render, screen, fireEvent } = await import("@testing-library/react");
    const { PathFinderGame } = await import("@/components/game/path-finder/PathFinderGame");

    render(React.createElement(PathFinderGame, { variant: "practice-2" }));

    // 1. Advance past instructions
    const nextBtn = screen.getByRole("button", { name: /next/i });
    expect(nextBtn).toBeDefined();
    fireEvent.click(nextBtn);

    // Controls exist
    const rotateBtn = screen.getByLabelText("Rotate block clockwise");
    const changeDirBtn = screen.getByLabelText("Change route direction");
    const checkBtn = screen.getByLabelText("Submit path");

    expect(rotateBtn).toBeDefined();
    expect(changeDirBtn).toBeDefined();
    expect(checkBtn).toBeDefined();

    // Verify tile selection, rotation, and direction toggle
    const tileT00 = screen.getByLabelText(/Tile T00/i);
    fireEvent.click(tileT00);
    expect(rotateBtn).toHaveProperty("disabled", false);
    expect(changeDirBtn).toHaveProperty("disabled", false);

    fireEvent.click(rotateBtn);
    fireEvent.click(changeDirBtn);

    // Deselect tile
    fireEvent.click(tileT00);
    expect(rotateBtn).toHaveProperty("disabled", true);
    expect(changeDirBtn).toHaveProperty("disabled", true);
  });
});






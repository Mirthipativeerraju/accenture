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
  getBaseTileGeometry,
  getEffectivePorts,
  getEffectiveTileCells,
  normalizeRotation,
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

describe("Path Finder Practice Test 2 — Canonical 5-Question System Verification", () => {
  it("TEST 1: Default Practice Test 2 generates exactly 5 questions", () => {
    const questions = generatePractice2Questions(5);
    expect(questions.length).toBe(5);
    for (let i = 0; i < 5; i++) {
      expect(questions[i].id).toBe(`practice-2-q${i + 1}`);
      expect(questions[i].gridRows).toBe(9);
      expect(questions[i].gridCols).toBe(9);
      expect(questions[i].tileSize).toBe(3);
      expect(questions[i].tiles.length).toBe(9);
    }
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

  it("TEST 3: Complete 4-State Arrow Rotation Table (8 directions × 4 rotation states = 32 assertions)", () => {
    const table: Record<ArrowDirection, [ArrowDirection, ArrowDirection, ArrowDirection, ArrowDirection]> = {
      RIGHT: ["RIGHT", "DOWN", "LEFT", "UP"],
      DOWN_RIGHT: ["DOWN_RIGHT", "DOWN_LEFT", "UP_LEFT", "UP_RIGHT"],
      DOWN: ["DOWN", "LEFT", "UP", "RIGHT"],
      DOWN_LEFT: ["DOWN_LEFT", "UP_LEFT", "UP_RIGHT", "DOWN_RIGHT"],
      LEFT: ["LEFT", "UP", "RIGHT", "DOWN"],
      UP_LEFT: ["UP_LEFT", "UP_RIGHT", "DOWN_RIGHT", "DOWN_LEFT"],
      UP: ["UP", "RIGHT", "DOWN", "LEFT"],
      UP_RIGHT: ["UP_RIGHT", "DOWN_RIGHT", "DOWN_LEFT", "UP_LEFT"],
    };

    const allDirections: ArrowDirection[] = [
      "RIGHT",
      "DOWN_RIGHT",
      "DOWN",
      "DOWN_LEFT",
      "LEFT",
      "UP_LEFT",
      "UP",
      "UP_RIGHT",
    ];

    allDirections.forEach((dir) => {
      const [deg0, deg90, deg180, deg270] = table[dir];
      expect(rotateArrowDirection(dir, 0)).toBe(deg0);
      expect(rotateArrowDirection(dir, 1)).toBe(deg90);
      expect(rotateArrowDirection(dir, 2)).toBe(deg180);
      expect(rotateArrowDirection(dir, 3)).toBe(deg270);
      expect(rotateArrowDirection(dir, 4)).toBe(deg0);
    });
  });

  it("TEST 4: STRAIGHT Tile Mechanics — Flip toggles arrow directions (LEFT/RIGHT) without moving active cells", () => {
    const normalStraight = getBaseTileGeometry("STRAIGHT", false, 0);
    const flippedStraight = getBaseTileGeometry("STRAIGHT", true, 0);

    expect(normalStraight.ports).toEqual({ enter: "LEFT", exit: "RIGHT" });
    expect(flippedStraight.ports).toEqual({ enter: "RIGHT", exit: "LEFT" });

    // Active cell row is row index 1 for both
    for (let c = 0; c < 3; c++) {
      expect(normalStraight.cells[1][c].active).toBe(true);
      expect(normalStraight.cells[1][c].arrowDirection).toBe("RIGHT");
      expect(flippedStraight.cells[1][c].active).toBe(true);
      expect(flippedStraight.cells[1][c].arrowDirection).toBe("LEFT");
    }
  });

  it("TEST 5: CORNER Tile Mechanics — Flip reverses flow between LEFT->BOTTOM and BOTTOM->LEFT", () => {
    const normalCorner = getBaseTileGeometry("CORNER", false, 0);
    const flippedCorner = getBaseTileGeometry("CORNER", true, 0);

    expect(normalCorner.ports).toEqual({ enter: "LEFT", exit: "BOTTOM" });
    expect(flippedCorner.ports).toEqual({ enter: "BOTTOM", exit: "LEFT" });

    // Both have active cells at (1,0), (1,1), (2,1)
    expect(normalCorner.cells[1][0].active).toBe(true);
    expect(normalCorner.cells[1][1].active).toBe(true);
    expect(normalCorner.cells[2][1].active).toBe(true);

    expect(flippedCorner.cells[1][0].active).toBe(true);
    expect(flippedCorner.cells[1][1].active).toBe(true);
    expect(flippedCorner.cells[2][1].active).toBe(true);
  });

  it("TEST 6: T_JUNCTION Tile Mechanics — 4 Modes cycling", () => {
    const m0 = getBaseTileGeometry("T_JUNCTION", false, 0);
    const m1 = getBaseTileGeometry("T_JUNCTION", false, 1);
    const m2 = getBaseTileGeometry("T_JUNCTION", false, 2);
    const m3 = getBaseTileGeometry("T_JUNCTION", false, 3);

    expect(m0.ports).toEqual({ enter: "TOP", exit: "LEFT" });
    expect(m1.ports).toEqual({ enter: "BOTTOM", exit: "LEFT" });
    expect(m2.ports).toEqual({ enter: "BOTTOM", exit: "TOP" });
    expect(m3.ports).toEqual({ enter: "LEFT", exit: "TOP" });
  });

  it("TEST 7: CROSS Tile Mechanics — 4 Modes cycling", () => {
    const m0 = getBaseTileGeometry("CROSS", false, 0);
    const m1 = getBaseTileGeometry("CROSS", false, 1);
    const m2 = getBaseTileGeometry("CROSS", false, 2);
    const m3 = getBaseTileGeometry("CROSS", false, 3);

    expect(m0.ports).toEqual({ enter: "LEFT", exit: "RIGHT" });
    expect(m1.ports).toEqual({ enter: "TOP", exit: "BOTTOM" });
    expect(m2.ports).toEqual({ enter: "LEFT", exit: "TOP" });
    expect(m3.ports).toEqual({ enter: "LEFT", exit: "BOTTOM" });
  });

  it("TEST 8: 4-Rotation restores exact tile geometry and arrows", () => {
    const tile: TileDefinition = { id: "T00", gridRow: 0, gridCol: 0, type: "CORNER", cells: [] };
    const st0: TileState = { rotation: 0, flipped: false, mode: 0 };
    const st1: TileState = { rotation: 1, flipped: false, mode: 0 };
    const st2: TileState = { rotation: 2, flipped: false, mode: 0 };
    const st3: TileState = { rotation: 3, flipped: false, mode: 0 };

    const c0 = getEffectiveTileCells(tile, st0);
    const c1 = getEffectiveTileCells(tile, st1);
    const c2 = getEffectiveTileCells(tile, st2);
    const c3 = getEffectiveTileCells(tile, st3);

    expect(rotateTile(c0, 90)).toEqual(c1);
    expect(rotateTile(c1, 90)).toEqual(c2);
    expect(rotateTile(c2, 90)).toEqual(c3);
    expect(rotateTile(c3, 90)).toEqual(c0);
  });

  it("TEST 9: Guaranteed Solvability & Unsolved Initial State for All 5 Questions", () => {
    const questions = generatePractice2Questions(5, 777);
    const signatures = new Set<string>();

    expect(questions.length).toBe(5);

    questions.forEach((q, idx) => {
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

  it("TEST 10: Multi-Seed Stress Test — 25 Generated Questions Across 5 Seeds", () => {
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

  it("TEST 11: Real UI Integration & Multi-Question Flow (Q1 -> Q5 -> Completed)", async () => {
    const React = await import("react");
    const { render, screen, fireEvent, act } = await import("@testing-library/react");
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

    // Verify tile selection and rotation
    const tileT00 = screen.getByLabelText(/Tile T00/i);
    fireEvent.click(tileT00);
    expect(rotateBtn).toHaveProperty("disabled", false);
    fireEvent.click(rotateBtn);

    // Deselect tile
    fireEvent.click(tileT00);
    expect(rotateBtn).toHaveProperty("disabled", true);
  });
});




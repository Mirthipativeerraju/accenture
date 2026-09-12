import { describe, it, expect } from "vitest";
import {
  rotateArrow,
  reverseArrow,
  rotateTile,
  reverseTileDirection,
  buildBoard,
} from "@/lib/games/path-finder/transformations";
import { validateRoute } from "@/lib/games/path-finder/validator";
import { getMoveCost } from "@/lib/games/path-finder/solver";
import { PRACTICE_TEST_1_PUZZLES } from "@/lib/games/path-finder/practice-1-puzzle";
import { RouteCell } from "@/lib/games/path-finder/types";

describe("Path Finder 9x9 Engine & Rules", () => {
  const p1 = PRACTICE_TEST_1_PUZZLES[0];
  const p2 = PRACTICE_TEST_1_PUZZLES[1];

  it("1. Puzzle 1 and Puzzle 2 have exactly 9x9 grid with 9 tiles of 3x3", () => {
    expect(p1.gridRows).toBe(9);
    expect(p1.gridCols).toBe(9);
    expect(p1.tiles.length).toBe(9);
    expect(p1.tileSize).toBe(3);

    expect(p2.gridRows).toBe(9);
    expect(p2.gridCols).toBe(9);
    expect(p2.tiles.length).toBe(9);
    expect(p2.tileSize).toBe(3);
  });

  it("2. rotates arrows clockwise 90 degrees correctly", () => {
    expect(rotateArrow("RIGHT")).toBe("DOWN");
    expect(rotateArrow("DOWN")).toBe("LEFT");
    expect(rotateArrow("LEFT")).toBe("UP");
    expect(rotateArrow("UP")).toBe("RIGHT");

    expect(rotateArrow("UP_LEFT")).toBe("UP_RIGHT");
    expect(rotateArrow("UP_RIGHT")).toBe("DOWN_RIGHT");
    expect(rotateArrow("DOWN_RIGHT")).toBe("DOWN_LEFT");
    expect(rotateArrow("DOWN_LEFT")).toBe("UP_LEFT");
  });

  it("3. reverses arrows correctly", () => {
    expect(reverseArrow("RIGHT")).toBe("LEFT");
    expect(reverseArrow("LEFT")).toBe("RIGHT");
    expect(reverseArrow("UP")).toBe("DOWN");
    expect(reverseArrow("DOWN")).toBe("UP");

    expect(reverseArrow("UP_LEFT")).toBe("DOWN_RIGHT");
    expect(reverseArrow("DOWN_RIGHT")).toBe("UP_LEFT");
    expect(reverseArrow("UP_RIGHT")).toBe("DOWN_LEFT");
    expect(reverseArrow("DOWN_LEFT")).toBe("UP_RIGHT");
  });

  it("4. four 90-degree rotations return tile to original state", () => {
    const original: RouteCell[][] = [
      [{ active: true, arrowDirection: "UP" }, { active: false }, { active: false }],
      [{ active: true, arrowDirection: "LEFT" }, { active: true, arrowDirection: "UP_LEFT" }, { active: false }],
      [{ active: false }, { active: false }, { active: false }],
    ];

    const rot90 = rotateTile(original, 90);
    const rot180 = rotateTile(rot90, 90);
    const rot270 = rotateTile(rot180, 90);
    const rot360 = rotateTile(rot270, 90);

    expect(rot360).toEqual(original);
  });

  it("5. direction reversal does not change active cell coordinates", () => {
    const original: RouteCell[][] = [
      [{ active: true, arrowDirection: "UP" }, { active: false }, { active: false }],
      [{ active: true, arrowDirection: "LEFT" }, { active: true, arrowDirection: "UP_LEFT" }, { active: false }],
      [{ active: false }, { active: false }, { active: false }],
    ];

    const reversed = reverseTileDirection(original);
    expect(reversed[0][0].active).toBe(true);
    expect(reversed[0][0].arrowDirection).toBe("DOWN");
    expect(reversed[1][0].active).toBe(true);
    expect(reversed[1][0].arrowDirection).toBe("RIGHT");
    expect(reversed[1][1].active).toBe(true);
    expect(reversed[1][1].arrowDirection).toBe("DOWN_RIGHT");
  });

  it("6. per-tile rotation and direction states are independent", () => {
    const states = { ...p1.initialTileStates };
    states["T00"] = { rotation: 1, directionReversed: true };

    expect(states["T01"].rotation).toBe(0);
    expect(states["T01"].directionReversed).toBe(false);
  });

  it("7. correctly calculates move cost", () => {
    expect(getMoveCost({ rotation: 0, directionReversed: false }, { rotation: 1, directionReversed: false })).toBe(1);
    expect(getMoveCost({ rotation: 0, directionReversed: false }, { rotation: 2, directionReversed: false })).toBe(2);
    expect(getMoveCost({ rotation: 0, directionReversed: false }, { rotation: 0, directionReversed: true })).toBe(1);
    expect(getMoveCost({ rotation: 0, directionReversed: false }, { rotation: 1, directionReversed: true })).toBe(2);
  });

  it("8. initial Puzzle 1 starts in unsolved state", () => {
    const result = validateRoute(p1, p1.initialTileStates);
    expect(result.isValid).toBe(false);
  });

  it("9. initial Question 2 matches exact 9x9 matrix and start/destination setup", () => {
    expect(p2.startPos.row).toBe(1);
    expect(p2.startPos.col).toBe(0);
    expect(p2.destinationPos.row).toBe(1);
    expect(p2.destinationPos.col).toBe(8);

    const grid = buildBoard(p2, p2.initialTileStates);
    expect(grid.length).toBe(9);
    expect(grid[0].length).toBe(9);

    // ROW 0 (Row 1): [".", "UP", ".", ".", ".", ".", ".", ".", "."]
    expect(grid[0][0].active).toBe(false);
    expect(grid[0][1].arrowDirection).toBe("UP");
    expect(grid[0][2].active).toBe(false);

    // ROW 1 (Row 2): ["EMPTY_ACTIVE", "UP_LEFT", "LEFT", "RIGHT", "DOWN_RIGHT", ".", "RIGHT", "DOWN_RIGHT", "."]
    expect(grid[1][0].active).toBe(true);
    expect(grid[1][0].arrowDirection).toBeUndefined();
    expect(grid[1][1].arrowDirection).toBe("UP_LEFT");
    expect(grid[1][2].arrowDirection).toBe("LEFT");
    expect(grid[1][3].arrowDirection).toBe("RIGHT");
    expect(grid[1][4].arrowDirection).toBe("DOWN_RIGHT");
    expect(grid[1][5].active).toBe(false);
    expect(grid[1][6].arrowDirection).toBe("RIGHT");
    expect(grid[1][7].arrowDirection).toBe("DOWN_RIGHT");
    expect(grid[1][8].active).toBe(false);

    // ROW 2 (Row 3): [".", ".", ".", ".", "DOWN", ".", ".", "DOWN", "."]
    expect(grid[2][4].arrowDirection).toBe("DOWN");
    expect(grid[2][7].arrowDirection).toBe("DOWN");

    // ROW 3 (Row 4): [".", ".", ".", ".", "UP", ".", ".", "DOWN", "."]
    expect(grid[3][4].arrowDirection).toBe("UP");
    expect(grid[3][7].arrowDirection).toBe("DOWN");

    // ROW 4 (Row 5): ["RIGHT", "DOWN_RIGHT", ".", ".", "UP_LEFT", "LEFT", ".", "DOWN", "."]
    expect(grid[4][0].arrowDirection).toBe("RIGHT");
    expect(grid[4][1].arrowDirection).toBe("DOWN_RIGHT");
    expect(grid[4][4].arrowDirection).toBe("UP_LEFT");
    expect(grid[4][5].arrowDirection).toBe("LEFT");
    expect(grid[4][7].arrowDirection).toBe("DOWN");

    // ROW 5 (Row 6): [".", "DOWN", ".", ".", "EMPTY_ACTIVE", ".", ".", "DOWN", "."]
    expect(grid[5][1].arrowDirection).toBe("DOWN");
    expect(grid[5][4].active).toBe(true);
    expect(grid[5][4].arrowDirection).toBeUndefined();
    expect(grid[5][7].arrowDirection).toBe("DOWN");

    // ROW 6 (Row 7): [".", "UP", ".", ".", "DOWN", ".", ".", "UP", "."]
    expect(grid[6][1].arrowDirection).toBe("UP");
    expect(grid[6][4].arrowDirection).toBe("DOWN");
    expect(grid[6][7].arrowDirection).toBe("UP");

    // ROW 7 (Row 8): ["EMPTY_ACTIVE", "UP", "EMPTY_ACTIVE", ".", "DOWN_RIGHT", "RIGHT", "RIGHT", "UP_RIGHT", "."]
    expect(grid[7][0].active).toBe(true);
    expect(grid[7][0].arrowDirection).toBeUndefined();
    expect(grid[7][1].arrowDirection).toBe("UP");
    expect(grid[7][2].active).toBe(true);
    expect(grid[7][2].arrowDirection).toBeUndefined();
    expect(grid[7][4].arrowDirection).toBe("DOWN_RIGHT");
    expect(grid[7][5].arrowDirection).toBe("RIGHT");
    expect(grid[7][6].arrowDirection).toBe("RIGHT");
    expect(grid[7][7].arrowDirection).toBe("UP_RIGHT");

    // ROW 8 (Row 9): [".", "UP", ".", ".", ".", ".", ".", ".", "."]
    expect(grid[8][1].arrowDirection).toBe("UP");

    const result = validateRoute(p2, p2.initialTileStates);
    expect(result.isValid).toBe(false);
  });
});

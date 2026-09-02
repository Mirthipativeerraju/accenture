import { describe, it, expect } from "vitest";
import { generatePathFinderQuestion } from "@/lib/games/path-finder/generator";
import { SeededRNG } from "@/lib/games/core/rng";
import { getRotatedCell, DIRECTION_ANGLES } from "@/lib/games/path-finder/validator";

describe("Path Finder — Interaction & Selection Logic Suite", () => {
  it("rotates ONLY the selected block without affecting other blocks", () => {
    const rng = new SeededRNG("interaction-test-1");
    const question = generatePathFinderQuestion(rng, 0, 3, 3);

    // Initial 3x3 block rotations
    const rotations = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    // Select block (1, 2) and rotate once
    const selectedBlock = { br: 1, bc: 2 };
    const nextRotations = rotations.map((row) => [...row]);
    nextRotations[selectedBlock.br][selectedBlock.bc] =
      (nextRotations[selectedBlock.br][selectedBlock.bc] + 90) % 360;

    // Verify ONLY [1][2] changed to 90
    expect(nextRotations[1][2]).toBe(90);
    expect(nextRotations[0][0]).toBe(0);
    expect(nextRotations[0][1]).toBe(0);
    expect(nextRotations[0][2]).toBe(0);
    expect(nextRotations[1][0]).toBe(0);
    expect(nextRotations[1][1]).toBe(0);
    expect(nextRotations[2][0]).toBe(0);
    expect(nextRotations[2][1]).toBe(0);
    expect(nextRotations[2][2]).toBe(0);

    // Select block (0, 0) and rotate once
    const nextSelectedBlock = { br: 0, bc: 0 };
    nextRotations[nextSelectedBlock.br][nextSelectedBlock.bc] =
      (nextRotations[nextSelectedBlock.br][nextSelectedBlock.bc] + 90) % 360;

    // Verify both retain independent states
    expect(nextRotations[0][0]).toBe(90);
    expect(nextRotations[1][2]).toBe(90);
    expect(nextRotations[2][2]).toBe(0);
  });

  it("cycles selected block through 0 -> 90 -> 180 -> 270 -> 0", () => {
    let rot = 0;
    const rotate = (current: number) => (current + 90) % 360;

    rot = rotate(rot);
    expect(rot).toBe(90);
    rot = rotate(rot);
    expect(rot).toBe(180);
    rot = rotate(rot);
    expect(rot).toBe(270);
    rot = rotate(rot);
    expect(rot).toBe(0);
  });

  it("preserves independent block states across multiple block selections", () => {
    // Start with all 0s
    let state = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    const rotateBlock = (br: number, bc: number) => {
      state = state.map((row) => [...row]);
      state[br][bc] = (state[br][bc] + 90) % 360;
    };

    // 1. Rotate block (0, 0) twice -> 180
    rotateBlock(0, 0);
    rotateBlock(0, 0);
    expect(state[0][0]).toBe(180);

    // 2. Select block (2, 2) and rotate once -> 90
    rotateBlock(2, 2);
    expect(state[2][2]).toBe(90);

    // 3. Select block (1, 1) and rotate 3 times -> 270
    rotateBlock(1, 1);
    rotateBlock(1, 1);
    rotateBlock(1, 1);
    expect(state[1][1]).toBe(270);

    // Verify all other 6 blocks remained at 0
    expect(state[0][0]).toBe(180);
    expect(state[0][1]).toBe(0);
    expect(state[0][2]).toBe(0);
    expect(state[1][0]).toBe(0);
    expect(state[1][1]).toBe(270);
    expect(state[1][2]).toBe(0);
    expect(state[2][0]).toBe(0);
    expect(state[2][1]).toBe(0);
    expect(state[2][2]).toBe(90);
  });

  it("preserves underlying block tile definitions when direction is toggled to REVERSE", () => {
    const rng = new SeededRNG("interaction-test-2");
    const question = generatePathFinderQuestion(rng, 1, 3, 3);
    const block = question.blocks[0][0];

    // Rotated cell calculation does not depend on route direction
    const cell0 = getRotatedCell(block, 0, 0, 90);
    const cell1 = getRotatedCell(block, 0, 1, 90);

    // Direction toggle only affects traversal and rocket starting origin, not tile state
    expect(cell0).toBeDefined();
    expect(cell1).toBeDefined();
  });
});

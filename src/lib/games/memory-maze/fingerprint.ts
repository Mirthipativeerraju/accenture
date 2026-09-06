import { MemoryMazeQuestion, Position, Direction, isWallBetween } from "./types";

/**
 * Computes a canonical structural fingerprint of a maze.
 * The fingerprint is invariant under:
 * - Translation / coordinate shifting
 * - 90, 180, 270 degree rotation
 * - Horizontal / vertical / diagonal reflection
 *
 * This ensures that a maze that is simply rotated, mirrored, or translated
 * is recognized as structurally equivalent.
 */
export function getMazeStructuralFingerprint(maze: MemoryMazeQuestion): string {
  const start = maze.playerStartPosition;
  const key1 = maze.key1Position || maze.keyPosition;
  const key2 = maze.key2Position;
  const door = maze.doorPosition;
  const size = maze.gridSize || 3;
  const walls = maze.walls || [];

  // Extract all open bidirectional edges between adjacent cells
  const openEdges: [Position, Position][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const from: Position = { row: r, col: c };

      // Right neighbor
      if (c + 1 < size) {
        const to: Position = { row: r, col: c + 1 };
        if (!isWallBetween(walls, from, "right")) {
          openEdges.push([from, to]);
        }
      }

      // Down neighbor
      if (r + 1 < size) {
        const to: Position = { row: r + 1, col: c };
        if (!isWallBetween(walls, from, "down")) {
          openEdges.push([from, to]);
        }
      }
    }
  }

  // 8 Dihedral transformations for an NxN grid:
  // (r, c) -> (r', c')
  const transforms: ((p: Position, N: number) => Position)[] = [
    // 0 deg rotation
    (p, _) => ({ row: p.row, col: p.col }),
    // 90 deg clockwise
    (p, N) => ({ row: p.col, col: N - 1 - p.row }),
    // 180 deg
    (p, N) => ({ row: N - 1 - p.row, col: N - 1 - p.col }),
    // 270 deg clockwise
    (p, N) => ({ row: N - 1 - p.col, col: p.row }),
    // Reflection horizontal (flip row)
    (p, N) => ({ row: N - 1 - p.row, col: p.col }),
    // Reflection vertical (flip col)
    (p, N) => ({ row: p.row, col: N - 1 - p.col }),
    // Diagonal transpose
    (p, _) => ({ row: p.col, col: p.row }),
    // Anti-diagonal transpose
    (p, N) => ({ row: N - 1 - p.col, col: N - 1 - p.row }),
  ];

  const variants: string[] = [];

  for (const transform of transforms) {
    const tStart = transform(start, size);
    const tKey1 = transform(key1, size);
    const tKey2 = key2 ? transform(key2, size) : null;
    const tDoor = transform(door, size);

    const tEdges: string[] = openEdges.map(([p1, p2]) => {
      const tp1 = transform(p1, size);
      const tp2 = transform(p2, size);
      const k1 = `${tp1.row},${tp1.col}`;
      const k2 = `${tp2.row},${tp2.col}`;
      return k1 < k2 ? `${k1}->${k2}` : `${k2}->${k1}`;
    });

    tEdges.sort();

    // Find bounding box to normalize translation
    const allPoints = [
      tStart,
      tKey1,
      ...(tKey2 ? [tKey2] : []),
      tDoor,
      ...openEdges.flatMap(([p1, p2]) => [transform(p1, size), transform(p2, size)]),
    ];

    const minRow = Math.min(...allPoints.map((p) => p.row));
    const minCol = Math.min(...allPoints.map((p) => p.col));

    const normStart = `${tStart.row - minRow},${tStart.col - minCol}`;
    const normKey1 = `${tKey1.row - minRow},${tKey1.col - minCol}`;
    const normKey2 = tKey2 ? `${tKey2.row - minRow},${tKey2.col - minCol}` : "none";
    const normDoor = `${tDoor.row - minRow},${tDoor.col - minCol}`;

    const normEdges = tEdges
      .map((edge) => {
        const [a, b] = edge.split("->");
        const [ar, ac] = a.split(",").map(Number);
        const [br, bc] = b.split(",").map(Number);
        const na = `${ar - minRow},${ac - minCol}`;
        const nb = `${br - minRow},${bc - minCol}`;
        return na < nb ? `${na}->${nb}` : `${nb}->${na}`;
      })
      .sort()
      .join(";");

    const variantString = `S:${normStart}|K1:${normKey1}|K2:${normKey2}|D:${normDoor}|E:${normEdges}`;
    variants.push(variantString);
  }

  // Canonical fingerprint is the lexicographically smallest representation
  variants.sort();
  return variants[0];
}

/**
 * Checks if two mazes are structurally equivalent (including rotation/reflection).
 */
export function areMazesStructurallyEquivalent(m1: MemoryMazeQuestion, m2: MemoryMazeQuestion): boolean {
  return getMazeStructuralFingerprint(m1) === getMazeStructuralFingerprint(m2);
}

/**
 * Checks if a candidate maze structurally matches any maze in the given reference list.
 */
export function doesMazeMatchReferencePool(
  candidate: MemoryMazeQuestion,
  referencePool: MemoryMazeQuestion[]
): boolean {
  const candidateFp = getMazeStructuralFingerprint(candidate);
  return referencePool.some((ref) => getMazeStructuralFingerprint(ref) === candidateFp);
}

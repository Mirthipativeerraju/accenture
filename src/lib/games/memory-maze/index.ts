import { gameRegistry } from "../core/registry";
import { memoryMazeDefinition } from "./engine";

export function registerMemoryMaze() {
  gameRegistry.register(memoryMazeDefinition as unknown as Parameters<typeof gameRegistry.register>[0]);
}

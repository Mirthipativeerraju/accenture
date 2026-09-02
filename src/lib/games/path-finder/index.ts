import { gameRegistry } from "../core/registry";
import { pathFinderDefinition } from "./engine";

export function registerPathFinder() {
  gameRegistry.register(pathFinderDefinition as unknown as Parameters<typeof gameRegistry.register>[0]);
}

export * from "./types";
export * from "./engine";
export * from "./generator";
export * from "./validator";

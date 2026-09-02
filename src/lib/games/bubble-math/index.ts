import { gameRegistry } from "../core/registry";
import { bubbleMathDefinition } from "./engine";

// Register automatically on import if needed, though usually better done at app initialization.
// We'll export the definition and a registration helper.

export function registerBubbleMath() {
  gameRegistry.register(bubbleMathDefinition);
}

export * from "./types";
export * from "./engine";
export * from "./evaluator";
export * from "./generator";

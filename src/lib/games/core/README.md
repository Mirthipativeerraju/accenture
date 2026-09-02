# N2 Game Engine Architecture

This directory (`src/lib/games/core`) contains the pure TypeScript foundational architecture for all game modes in the Assessment Simulator.

## Core Layers
1. **Types**: Shared generics (`GameDefinition`, `GameSession`, `GameAction`, etc.).
2. **Registry**: Central store for game definitions. N3-N5 games register themselves here.
3. **SessionController**: Pure finite state machine transitioning sessions (`IDLE` -> `READY` -> `PLAYING` -> `COMPLETED`). Validates and applies actions through the `GameDefinition`.
4. **AssessmentTimerEngine**: Timestamp-based timer (`Date.now()`). Does not use decrementing `setInterval` counters, ensuring background visibility and throttling do not cause drift.
5. **SeededRNG**: Deterministic Mulberry32 algorithm. Allows reproducing exact game layouts from a `seed` string.
6. **Persistence**: Versioned `LocalStorage` abstraction. Ready to swap with a MongoDB API later without changing game logic.
7. **Scoring**: Base abstractions for parsing raw metrics into a practice score.

## Zustand Integration
Zustand is used strictly as a React integration layer in `src/lib/store/game-session.ts`. 
It wraps the `SessionController` and `AssessmentTimerEngine` to synchronize state for UI consumption. **Do not put game rules into Zustand.**

## Integrating a New Game (e.g. N3 Bubble Math)
To add Bubble Math in N3:
1. Create `src/lib/games/bubble-math/engine.ts`.
2. Define the game logic strictly matching the `GameDefinition` interface.
3. Call `gameRegistry.register(bubbleMathDefinition)`.
4. Build the React UI in `src/components/game/bubble-math/` using `useGameSessionStore()`.

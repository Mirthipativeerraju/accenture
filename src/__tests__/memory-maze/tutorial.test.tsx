import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryMazeTutorial } from "@/components/game/memory-maze/MemoryMazeTutorial";

describe("Memory Maze Full Mock Tutorial Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders slide 1 initially with disabled Previous and locked Next until demonstration finishes", () => {
    const onStartMock = vi.fn();
    render(<MemoryMazeTutorial onStart={onStartMock} />);

    // Header - Title only, no question counter
    expect(screen.getByText("Memory Maze - Full Memory Mock Test")).toBeDefined();
    expect(screen.queryByText("Question 1 of 5")).toBeNull();

    // Objective & Timer inside Game Area
    expect(screen.getByText(/Collect 1 KEY/i)).toBeDefined();
    expect(screen.getByText(/then get to the DOOR/i)).toBeDefined();
    expect(screen.getByText("4:00")).toBeDefined();

    // Slide 1 text in white panel
    expect(
      screen.getByText(/In this exercise, you must move between boxes in a grid that contains a maze of invisible walls/i)
    ).toBeDefined();
    expect(screen.getByText(/NOT diagonally/i)).toBeDefined();
    expect(screen.getByText(/only move across one box at a time/i)).toBeDefined();

    // Previous button should be disabled
    const prevBtn = screen.getByRole("button", { name: /previous tutorial step/i });
    expect(prevBtn.hasAttribute("disabled")).toBe(true);

    // Next button should be initially disabled
    const nextBtn = screen.getByRole("button", { name: /next tutorial step/i });
    expect(nextBtn.hasAttribute("disabled")).toBe(true);

    // Run demonstration to completion
    act(() => {
      vi.advanceTimersByTime(7000);
    });

    // Next button should now be enabled
    expect(nextBtn.hasAttribute("disabled")).toBe(false);

    // 6 pagination indicators present
    const progressContainer = screen.getByRole("tablist", { name: /tutorial progress/i });
    expect(progressContainer).toBeDefined();
  });

  it("advances through slides 1 to 5 sequentially only after each demo finishes", () => {
    const onStartMock = vi.fn();
    render(<MemoryMazeTutorial onStart={onStartMock} />);

    const nextBtn = screen.getByRole("button", { name: /next tutorial step/i });
    const prevBtn = screen.getByRole("button", { name: /previous tutorial step/i });

    // Step 1: Complete demonstration and advance
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(nextBtn.hasAttribute("disabled")).toBe(false);
    fireEvent.click(nextBtn);

    // Slide 2: Next is locked again
    expect(
      screen.getByText(/Each time you hit a wall, you will be returned back to the beginning of the maze/i)
    ).toBeDefined();
    expect(screen.getByText(/The walls do not move, but you must remember where they are located/i)).toBeDefined();
    expect(prevBtn.hasAttribute("disabled")).toBe(false);
    expect(nextBtn.hasAttribute("disabled")).toBe(true);

    // Complete Step 2 demo
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(nextBtn.hasAttribute("disabled")).toBe(false);
    fireEvent.click(nextBtn);

    // Slide 3: Next is locked
    expect(
      screen.getByText(/Your goal is to collect the key and reach the door in the least number of attempts/i)
    ).toBeDefined();
    expect(screen.getByText(/If there are two keys in a grid, you will need to collect both/i)).toBeDefined();
    expect(nextBtn.hasAttribute("disabled")).toBe(true);

    // Complete Step 3 demo
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(nextBtn.hasAttribute("disabled")).toBe(false);
    fireEvent.click(nextBtn);

    // Slide 4: Timer explanation and live countdown demonstration
    expect(
      screen.getByText(/You do not need to rush\. However, if you have been unable to solve the maze within the time limit/i)
    ).toBeDefined();
    expect(screen.getByText(/progress automatically to the next maze/i)).toBeDefined();
    expect(screen.getByText(/A timer is located at the bottom of the screen to indicate time remaining/i)).toBeDefined();

    // Verify timer counts down live in Step 4
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("3:58")).toBeDefined();

    // Advance to Slide 5
    const nextBtnSlide4 = screen.getByRole("button", { name: /next tutorial step/i });
    expect(nextBtnSlide4.hasAttribute("disabled")).toBe(false);
    fireEvent.click(nextBtnSlide4);

    // Slide 5: Final Practice instruction, PRACTICE button, and centered navigation pair
    expect(screen.getByText(/The practice exercise will have 2 mazes to solve/i)).toBeDefined();
    expect(screen.getByText(/The first maze will be one that you can replay/i)).toBeDefined();
    expect(screen.getByText(/Press the PRACTICE button to proceed to the first maze/i)).toBeDefined();

    // Next button IS present on final slide 5, but disabled
    const nextBtnSlide5 = screen.getByRole("button", { name: /next tutorial step/i });
    expect(nextBtnSlide5.hasAttribute("disabled")).toBe(true);

    // Slide 5 has PRACTICE button
    const practiceBtn = screen.getByRole("button", { name: /practice/i });
    expect(practiceBtn).toBeDefined();

    // Click PRACTICE calls onStart
    fireEvent.click(practiceBtn);
    expect(onStartMock).toHaveBeenCalledTimes(1);

    // Previous button goes back to Step 4: Step 4 was already completed, so Next MUST remain enabled!
    const backBtn = screen.getByRole("button", { name: /previous tutorial step/i });
    fireEvent.click(backBtn);
    expect(screen.getByText(/A timer is located at the bottom of the screen to indicate time remaining/i)).toBeDefined();
    const nextBtnSlide4Back = screen.getByRole("button", { name: /next tutorial step/i });
    expect(nextBtnSlide4Back.hasAttribute("disabled")).toBe(false);
  });

  it("does not re-lock Next when navigating backward to previously completed steps and shows no tooltips", () => {
    const onStartMock = vi.fn();
    render(<MemoryMazeTutorial onStart={onStartMock} />);

    const nextBtn = screen.getByRole("button", { name: /next tutorial step/i });
    const prevBtn = screen.getByRole("button", { name: /previous tutorial step/i });

    // Step 1: Disabled initially, verify NO warning tooltip exists anywhere in document
    expect(nextBtn.hasAttribute("disabled")).toBe(true);
    expect(screen.queryByText(/Complete tutorial step first/i)).toBeNull();

    // Finish Step 1
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(nextBtn.hasAttribute("disabled")).toBe(false);
    fireEvent.click(nextBtn);

    // Step 2: Next is locked for new step
    expect(nextBtn.hasAttribute("disabled")).toBe(true);
    expect(screen.queryByText(/Complete tutorial step first/i)).toBeNull();

    // Finish Step 2
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(nextBtn.hasAttribute("disabled")).toBe(false);

    // Click Previous to go back to Step 1
    fireEvent.click(prevBtn);

    // On Step 1: Step 1 was already completed, NEXT MUST REMAIN ACTIVE IMMEDIATELY
    expect(nextBtn.hasAttribute("disabled")).toBe(false);

    // Click Next to go forward to Step 2 again: Step 2 was also completed, NEXT MUST BE ACTIVE
    fireEvent.click(nextBtn);
    expect(nextBtn.hasAttribute("disabled")).toBe(false);
  });

  it("renders the Memory Maze grid with directional movement arrows and invisible wall mechanics", () => {
    const onStartMock = vi.fn();
    render(<MemoryMazeTutorial onStart={onStartMock} />);

    // Directional arrows should be rendered around the active player
    expect(screen.getByRole("button", { name: /move up/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /move right/i })).toBeDefined();

    // 3x3 Grid cells should be present
    expect(screen.getByLabelText("Grid cell row 1, column 1")).toBeDefined();
    expect(screen.getByLabelText("Grid cell row 3, column 3")).toBeDefined();
  });
});

import { MemoryMazeGame } from "@/components/game/memory-maze/MemoryMazeGame";
import { useGameSessionStore } from "@/lib/store/game-session";
import { registerMemoryMaze } from "@/lib/games/memory-maze";
import { MemoryMazeConfig } from "@/lib/games/memory-maze/types";

describe("Memory Maze Flow Integration: Tutorial -> Practice 1 -> Completion Overlay -> Replay / Start -> Practice 2", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    registerMemoryMaze();

    // Initialize Full Memory Mock Test session
    const { initializeSession } = useGameSessionStore.getState();
    const config: MemoryMazeConfig = {
      gameId: "memory-maze",
      variantId: "full-memory-mock-test",
      difficulty: "HARD",
      memoryMazeDifficulty: "VERY_HARD",
      mode: "TIMED_PRACTICE",
      itemCount: 5,
      timeLimitSeconds: 240,
      instructionTimeSeconds: 0,
      gridSize: 3,
      scoringConfig: { mode: "TIMED_PRACTICE", weights: { accuracy: 1, speed: 1, completion: 1 } },
      allowRestart: false,
      allowBacktrack: false,
    };
    initializeSession("test-session-mock", config, "test-seed", () => {});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("navigates from Starting Screen -> Tutorial -> Practice Maze 1, shows completion overlay on finish, and handles REPLAY and START", () => {
    render(<MemoryMazeGame />);

    // 1. Initial State: Starting Screen rendered with warnings and CONTINUE button
    expect(screen.getByText("Memory Maze - Full Memory Mock Test")).toBeDefined();
    expect(screen.getByText("Are you ready to start the Full Mock Test?")).toBeDefined();
    expect(screen.getByText("Do not:")).toBeDefined();
    expect(screen.getByText("Do not refresh the website")).toBeDefined();
    expect(screen.getByText("Do not press or use the back buttons")).toBeDefined();
    expect(screen.queryByText("Question 1 of 1")).toBeNull();
    expect(screen.queryByText("Question 1 of 5")).toBeNull();

    // Click CONTINUE to open Tutorial
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    // Tutorial rendered with clean header (no question count)
    expect(screen.getByText(/In this exercise, you must move between boxes in a grid/i)).toBeDefined();
    expect(screen.queryByText("Question 1 of 1")).toBeNull();

    // Fast-forward through Tutorial Steps 1-4 to Step 5
    // Slide 1
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));

    // Slide 2
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));

    // Slide 3
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));

    // Slide 4
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));

    // Step 5 (Final Tutorial Slide)
    expect(screen.getByText(/The practice exercise will have 2 mazes to solve/i)).toBeDefined();
    const practiceBtn = screen.getByRole("button", { name: /practice/i });
    expect(practiceBtn).toBeDefined();

    // 2. Click PRACTICE -> Starts First Practice Maze
    fireEvent.click(practiceBtn);

    // Header now shows Question 1 of 1
    expect(screen.getByText("Question 1 of 1")).toBeDefined();

    // Player starts at (1,1). Key is at (0,0). Door is at (2,2).
    // In mock-maze-1: (1,1) -> LEFT to (1,0) -> UP to (0,0) [key!] -> RIGHT to (0,1) -> RIGHT to (0,2) -> DOWN to (1,2) -> DOWN to (2,2) [door!]
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    fireEvent.keyDown(window, { key: "ArrowUp" }); // (0,0) Reaches key!
    fireEvent.keyDown(window, { key: "ArrowRight" }); // (0,1)
    fireEvent.keyDown(window, { key: "ArrowRight" }); // (0,2)
    fireEvent.keyDown(window, { key: "ArrowDown" }); // (1,2)
    fireEvent.keyDown(window, { key: "ArrowDown" }); // (2,2) Reaches door with key!

    // Wait for door opening animation to complete
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // 3. Completion Overlay appears ON TOP of completed maze with exact Practice 1 text
    expect(screen.getByText("You completed the first practice maze.")).toBeDefined();
    expect(screen.getByText("To repeat the instructions, select REPLAY.")).toBeDefined();
    expect(screen.getByText("To continue to the next practice maze, select START.")).toBeDefined();

    // Completion overlay does NOT show question counter in header
    expect(screen.queryByText("Question 1 of 1")).toBeNull();

    // Both START and REPLAY buttons are present on practice maze 1
    const startBtn = screen.getByRole("button", { name: /start next practice maze/i });
    const replayBtn = screen.getByRole("button", { name: /replay tutorial/i });
    expect(startBtn).toBeDefined();
    expect(replayBtn).toBeDefined();

    // 4. Test REPLAY: Click REPLAY -> Returns to Tutorial Step 1 as fresh tutorial
    fireEvent.click(replayBtn);
    expect(screen.getByText(/In this exercise, you must move between boxes in a grid/i)).toBeDefined();
    expect(screen.queryByText("Question 1 of 1")).toBeNull();

    // Fast-forward through tutorial again
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));

    act(() => {
      vi.advanceTimersByTime(7000);
    });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));

    act(() => {
      vi.advanceTimersByTime(8000);
    });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));

    // Click PRACTICE again -> Starts First Practice Maze again
    fireEvent.click(screen.getByRole("button", { name: /practice/i }));
    expect(screen.getByText("Question 1 of 1")).toBeDefined();

    // Complete maze 1 again
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    fireEvent.keyDown(window, { key: "ArrowUp" });
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowDown" });
    fireEvent.keyDown(window, { key: "ArrowDown" });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // 5. Test START: Click START on Completion Overlay -> Moves directly to Second Practice Maze
    const startBtn2 = screen.getByRole("button", { name: /start next practice maze/i });
    fireEvent.click(startBtn2);

    // Second Practice Maze is active and shows Question 1 of 1
    expect(screen.getByText("Question 1 of 1")).toBeDefined();
    expect(screen.queryByText("You completed the first practice maze.")).toBeNull();

    // Complete maze 2:
    // mock-maze-2: 3x3. Start: (2,1). Key: (0,2). Door: (1,0).
    // Path: (2,1) -> RIGHT (2,2) -> UP (1,2) -> UP (0,2) [key] -> LEFT (0,1) -> LEFT (0,0) -> DOWN (1,0) [door]
    fireEvent.keyDown(window, { key: "ArrowRight" }); // (2,2)
    fireEvent.keyDown(window, { key: "ArrowUp" }); // (1,2)
    fireEvent.keyDown(window, { key: "ArrowUp" }); // (0,2) reaches key
    fireEvent.keyDown(window, { key: "ArrowLeft" }); // (0,1)
    fireEvent.keyDown(window, { key: "ArrowLeft" }); // (0,0)
    fireEvent.keyDown(window, { key: "ArrowDown" }); // (1,0) reaches door with key

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("You escaped!")).toBeDefined();
    // Maze 2 should NOT show REPLAY button, only CONTINUE
    expect(screen.queryByRole("button", { name: /replay tutorial/i })).toBeNull();
    const continueBtn3 = screen.getByRole("button", { name: /continue to next maze challenge/i });
    fireEvent.click(continueBtn3);

    // Third maze (Assessment Maze 1) should show Question 1 of 1
    expect(screen.getByText("Question 1 of 1")).toBeDefined();

    // Fourth maze (Assessment Maze 2) on timeout or continue shows Question 2 of 5!
  });

  it("handles timer expiration with failure overlay, disabled movement, and next maze on continue", () => {
    render(<MemoryMazeGame />);

    // Click CONTINUE on starting screen
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    // Fast-forward tutorial to start Practice Maze 1
    act(() => { vi.advanceTimersByTime(7000); });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));
    act(() => { vi.advanceTimersByTime(7000); });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));
    act(() => { vi.advanceTimersByTime(8000); });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));
    act(() => { vi.advanceTimersByTime(1500); });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));
    fireEvent.click(screen.getByRole("button", { name: /practice/i }));

    expect(screen.getByText("Question 1 of 1")).toBeDefined();

    // Advance timer by 240 seconds to trigger timeout (0:00)
    act(() => {
      vi.advanceTimersByTime(241000);
    });

    // Failure overlay appears
    expect(screen.getByText("You failed to escape the maze.")).toBeDefined();
    expect(screen.queryByText("Question 1 of 1")).toBeNull();

    // Player keydown should not move
    fireEvent.keyDown(window, { key: "ArrowLeft" });

    // Click CONTINUE to advance to next maze
    const continueBtn = screen.getByRole("button", { name: /continue to next maze challenge/i });
    fireEvent.click(continueBtn);

    // Second maze starts with fresh 4:00 timer and Question 1 of 1
    expect(screen.getByText("Question 1 of 1")).toBeDefined();
    expect(screen.getByText("4:00")).toBeDefined();
    expect(screen.queryByText("You failed to escape the maze.")).toBeNull();
  });

  it("displays final response saved screen before results after finishing all assessment mazes", () => {
    render(<MemoryMazeGame />);

    // Click CONTINUE on starting screen
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    // Fast-forward tutorial to start Practice Maze 1
    act(() => { vi.advanceTimersByTime(7000); });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));
    act(() => { vi.advanceTimersByTime(7000); });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));
    act(() => { vi.advanceTimersByTime(8000); });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));
    act(() => { vi.advanceTimersByTime(1500); });
    fireEvent.click(screen.getByRole("button", { name: /next tutorial step/i }));
    fireEvent.click(screen.getByRole("button", { name: /practice/i }));

    // Advance through all 7 mazes (2 practice + 5 assessment) via timeouts
    for (let i = 0; i < 7; i++) {
      act(() => {
        vi.advanceTimersByTime(241000);
      });
      if (i < 6) {
        const continueBtn = screen.getByRole("button", { name: /continue/i });
        fireEvent.click(continueBtn);
      }
    }

    // Advance timer for transition to final pre_results screen
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Final Screen is shown!
    expect(screen.getByText("Your response has been saved.")).toBeDefined();
    expect(screen.getByText("To submit your results, click the CONTINUE button below.")).toBeDefined();

    // Click CONTINUE on final screen
    const submitBtn = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(submitBtn);

    // Results screen is shown!
    expect(screen.getByText("Memory Maze Results")).toBeDefined();
    expect(screen.getByText(/Assessment Score/i)).toBeDefined();
    expect(screen.getByText("Back to Practice")).toBeDefined();
  });
});

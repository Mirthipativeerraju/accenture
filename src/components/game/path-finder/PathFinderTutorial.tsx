"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ArrowLeftRight,
  Check,
  CheckCircle2,
} from "lucide-react";

interface PathFinderTutorialProps {
  onComplete: () => void;
}

// ============================================================================
// TYPES & ARROW ANGLES
// ============================================================================

type ArrowDir =
  | "UP"
  | "RIGHT"
  | "DOWN"
  | "LEFT"
  | "TOP_RIGHT"
  | "BOTTOM_RIGHT"
  | "BOTTOM_LEFT"
  | "TOP_LEFT";

const ARROW_ANGLES: Record<ArrowDir, number> = {
  UP: -90,
  RIGHT: 0,
  DOWN: 90,
  LEFT: 180,
  TOP_RIGHT: -45,
  BOTTOM_RIGHT: 45,
  BOTTOM_LEFT: 135,
  TOP_LEFT: -135,
};

interface DemoCell {
  active: boolean;
  arrow?: ArrowDir;
}

interface DemoTile {
  id: string;
  gridRow: number;
  gridCol: number;
  cells: DemoCell[][];
}

interface TutorialStep {
  slideNumber: number; // 1-7
  title: string;
  instruction: string;
  subText?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    slideNumber: 1,
    title: "The Goal",
    instruction:
      "Your goal is to create a path from the icon on the left to the icon on the right by rotating the tiles and changing the arrow directions. You should try to generate a path in the least number of moves.",
  },
  {
    slideNumber: 2,
    title: "Select a Tile",
    instruction: "Tap/click on a tile to select it.",
  },
  {
    slideNumber: 3,
    title: "Rotate a Tile",
    instruction:
      "Tap/click the rotate button to rotate the tile clockwise.",
  },
  {
    slideNumber: 4,
    title: "Change Route Direction",
    instruction:
      "Tap/click the direction button to change the direction of route.",
  },
  {
    slideNumber: 5,
    title: "Direction Button Behavior",
    instruction:
      "Please note that you can use the direction button to change the direction of the arrows for all possible paths entering and exiting the tile.",
  },
  {
    slideNumber: 7,
    title: "Check / Complete",
    instruction:
      "Once the route is complete, select the checkmark. If you have successfully created a path, the task is complete. If you have not successfully created a path, you will be able to try again.",
  },
  {
    slideNumber: 8,
    title: "Moves and Timer",
    instruction:
      "Your goal is to create a valid path in the least number of moves. You do not need to rush. However, if you have been unable to find a valid path within the time limit, you will progress automatically to the next question.",
    subText:
      "A timer is located at the bottom of the screen to indicate time remaining.",
  },
];

// Helper to create empty 3x3 cells
function createEmptyCells(): DemoCell[][] {
  return Array(3)
    .fill(null)
    .map(() =>
      Array(3)
        .fill(null)
        .map(() => ({ active: false }))
    );
}

// ============================================================================
// EXACT FIXED REFERENCE TUTORIAL BOARD
// ============================================================================
//
// 9x9 board divided into 3x3 tiles:
// - Top-Left route: ← ← ← → ↘ then ↓ ↓
// - Top-Right route: → ↘ then ↓ ↓
// - Central Vertical route: ↑ ↑ ↑ → → (connecting to right-side tile)
// - Left-Middle route: START → ↘ then ↓ ↓ ↓
// - Bottom route: ← ← ← ← ← ← ← and vertical ↑ ↑
// - Right-Side Tile (T12): Highlighted selectable tile with internal route
// - Large empty areas across the board
// ============================================================================

function getFixedReferenceBoard(): DemoTile[] {
  // Tile T00 (Row 0, Col 0): Top-Left horizontal route
  const t00Cells = createEmptyCells();
  t00Cells[0][0] = { active: true, arrow: "LEFT" };
  t00Cells[0][1] = { active: true, arrow: "LEFT" };
  t00Cells[0][2] = { active: true, arrow: "LEFT" };

  // Tile T01 (Row 0, Col 1): Top-Left turn and downward route
  const t01Cells = createEmptyCells();
  t01Cells[0][0] = { active: true, arrow: "RIGHT" };
  t01Cells[0][1] = { active: true, arrow: "BOTTOM_RIGHT" };
  t01Cells[1][1] = { active: true, arrow: "DOWN" };
  t01Cells[2][1] = { active: true, arrow: "DOWN" };

  // Tile T02 (Row 0, Col 2): Top-Right route
  const t02Cells = createEmptyCells();
  t02Cells[0][0] = { active: true, arrow: "RIGHT" };
  t02Cells[0][1] = { active: true, arrow: "BOTTOM_RIGHT" };
  t02Cells[1][1] = { active: true, arrow: "DOWN" };
  t02Cells[2][1] = { active: true, arrow: "DOWN" };

  // Tile T10 (Row 1, Col 0): Left-Middle route (Start at Row 1 local / Row 4 global)
  const t10Cells = createEmptyCells();
  t10Cells[1][0] = { active: true, arrow: "RIGHT" };
  t10Cells[1][1] = { active: true, arrow: "BOTTOM_RIGHT" };
  t10Cells[2][1] = { active: true, arrow: "DOWN" };

  // Tile T11 (Row 1, Col 1): Central Vertical route
  const t11Cells = createEmptyCells();
  t11Cells[0][1] = { active: true, arrow: "UP" };
  t11Cells[1][0] = { active: true, arrow: undefined };
  t11Cells[1][1] = { active: true, arrow: "UP" };
  t11Cells[1][2] = { active: true, arrow: undefined };
  t11Cells[2][1] = { active: true, arrow: "UP" };

  // Tile T12 (Row 1, Col 2): Right-Side Selectable / Rotatable Tile
  const t12Cells = createEmptyCells();
  t12Cells[0][1] = { active: true, arrow: "DOWN" };
  t12Cells[1][0] = { active: true, arrow: undefined };
  t12Cells[1][1] = { active: true, arrow: "BOTTOM_RIGHT" };
  t12Cells[1][2] = { active: true, arrow: "RIGHT" };

  // Tile T20 (Row 2, Col 0): Bottom-Left route
  const t20Cells = createEmptyCells();
  t20Cells[0][1] = { active: true, arrow: "DOWN" };
  
  t20Cells[1][1] = { active: true, arrow: "BOTTOM_RIGHT" };
  t20Cells[1][2] = { active: true, arrow: "RIGHT" };

  // Tile T21 (Row 2, Col 1): Bottom horizontal route
  const t21Cells = createEmptyCells();
  t21Cells[1][0] = { active: true, arrow: "LEFT" };
  t21Cells[1][1] = { active: true, arrow: "LEFT" };
  t21Cells[1][2] = { active: true, arrow: "LEFT" };

  // Tile T22 (Row 2, Col 2): Bottom-Right vertical route
  const t22Cells = createEmptyCells();
  t22Cells[0][1] = { active: true, arrow: "UP" };
  t22Cells[1][0] = { active: true, arrow: "RIGHT" };
  t22Cells[1][1] = { active: true, arrow: "TOP_RIGHT" };
  t22Cells[2][1] = { active: true, arrow: undefined };

  return [
    { id: "t00", gridRow: 0, gridCol: 0, cells: t00Cells },
    { id: "t01", gridRow: 0, gridCol: 1, cells: t01Cells },
    { id: "t02", gridRow: 0, gridCol: 2, cells: t02Cells },
    { id: "t10", gridRow: 1, gridCol: 0, cells: t10Cells },
    { id: "t11", gridRow: 1, gridCol: 1, cells: t11Cells },
    { id: "t12", gridRow: 1, gridCol: 2, cells: t12Cells },
    { id: "t20", gridRow: 2, gridCol: 0, cells: t20Cells },
    { id: "t21", gridRow: 2, gridCol: 1, cells: t21Cells },
    { id: "t22", gridRow: 2, gridCol: 2, cells: t22Cells },
  ];
}

// ============================================================================
// TUTORIAL 4 BOARD — T12 ALREADY ROTATED 90° CLOCKWISE
// ============================================================================
// T12 starts Tutorial 4 in exactly the state produced by one 90° clockwise
// rotation in Tutorial 3. The cell positions AND arrow directions are stored
// in their final visual state so the tile is not rotated a second time.
function getTutorial4Board(): DemoTile[] {
  const baseBoard = getFixedReferenceBoard();

  return baseBoard.map((tile) => {
    if (tile.id !== "t12") return tile;

    const t12Tutorial4Cells = createEmptyCells();

    // 90° clockwise rotated version of the original T12:
    // [0][1] = undefined
    // [1][1] = BOTTOM_LEFT
    // [1][2] = LEFT
    // [2][1] = DOWN
    t12Tutorial4Cells[0][1] = { active: true, arrow: undefined };
    t12Tutorial4Cells[1][1] = { active: true, arrow: "BOTTOM_LEFT" };
    t12Tutorial4Cells[1][2] = { active: true, arrow: "LEFT" };
    t12Tutorial4Cells[2][1] = { active: true, arrow: "DOWN" };

    return {
      ...tile,
      cells: t12Tutorial4Cells,
    };
  });
}


// ============================================================================
// TUTORIAL 5 BOARD — FIXED RESULT AFTER DIRECTION CHANGES
// ============================================================================
// T12 starts in its 90° clockwise rotated state from Tutorial 3.
// T12's arrows are also direction-changed once.
// T21 keeps its original shape but its arrows are direction-changed once.
// This board is fixed for Slide 5 so the direction-button behaviour can be
// demonstrated without changing the underlying board between frames.
function getTutorial5Board(): DemoTile[] {
  const baseBoard = getFixedReferenceBoard();

  return baseBoard.map((tile) => {
    if (tile.id === "t12") {
      const t12Tutorial5Cells = createEmptyCells();

      // T12: 90° clockwise rotated geometry from Tutorial 3,
      // with its arrows direction-changed once.
      // Tutorial 4 state:
      // [0][1] = undefined
      // [1][1] = BOTTOM_LEFT
      // [1][2] = LEFT
      // [2][1] = DOWN
      //
      // Direction change:
      // BOTTOM_LEFT -> TOP_RIGHT
      // LEFT -> RIGHT
      // DOWN -> UP
      t12Tutorial5Cells[0][1] = { active: true, arrow: undefined };
      t12Tutorial5Cells[1][1] = { active: true, arrow: "TOP_RIGHT" };
      t12Tutorial5Cells[1][2] = { active: true, arrow: "RIGHT" };
      t12Tutorial5Cells[2][1] = { active: true, arrow: "UP" };

      return {
        ...tile,
        cells: t12Tutorial5Cells,
      };
    }

    if (tile.id === "t21") {
      const t21Tutorial5Cells = createEmptyCells();

      // T21: same fixed geometry, with its arrows direction-changed once.
      t21Tutorial5Cells[1][0] = { active: true, arrow: "RIGHT" };
      t21Tutorial5Cells[1][1] = { active: true, arrow: "RIGHT" };
      t21Tutorial5Cells[1][2] = { active: true, arrow: "RIGHT" };

      return {
        ...tile,
        cells: t21Tutorial5Cells,
      };
    }

    return tile;
  });
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PathFinderTutorial({ onComplete }: PathFinderTutorialProps) {
  // Current screen: -1 = Introduction screen, 0..6 = Tutorial Demonstration steps 1..7
  const [screenIndex, setScreenIndex] = useState<number>(-1);

  // Animation cycle counter (0..100) inside current step
  const [animTick, setAnimTick] = useState<number>(0);

  // Demonstration state variables derived per step
  const [selectedTileKey, setSelectedTileKey] = useState<string | null>(null);
  const [t12RotateDeg, setT12RotateDeg] = useState<number>(0);
const [t21RotateDeg, setT21RotateDeg] = useState<number>(0);
  const [dirReversed, setDirReversed] = useState<boolean>(false);
  const [t12DirReversed, setT12DirReversed] = useState<boolean>(false);
  const [t21DirReversed, setT21DirReversed] = useState<boolean>(false);
  // Slide 6 valid-route rocket animation state
  const [rocketState, setRocketState] = useState({ left: -10, top: 50, angle: 0 });
  const [activeBtn, setActiveBtn] = useState<"rotate" | "dir" | "check" | null>(
    null
  );
  const [cursorPos, setCursorPos] = useState<{
    x: number;
    y: number;
    opacity: number;
    clicking: boolean;
  }>({
    x: 83,
    y: 50,
    opacity: 0,
    clicking: false,
  });
  const [showCompletionFeedback, setShowCompletionFeedback] =
    useState<boolean>(false);
  const [highlightTimer, setHighlightTimer] = useState<boolean>(false);

  // Reset & restart demonstration timer whenever screen changes
  useEffect(() => {
    if (screenIndex === -1) return;

    setAnimTick(0);
    setSelectedTileKey(null);
    setT12RotateDeg(0);
setT21RotateDeg(0);
    setDirReversed(false);
    setT12DirReversed(false);
    setT21DirReversed(false);
    setRocketState({ left: -10, top: 50, angle: 0 });
    setActiveBtn(null);
    setShowCompletionFeedback(false);
    setHighlightTimer(false);
    setCursorPos({ x: 83, y: 50, opacity: 0, clicking: false });

    // Cycle length: 200 ticks (9s) for rotation slide, 140 ticks (6.3s) for direction slide, 100 ticks (4.5s) for others
    const maxTicks =
      screenIndex === 2
        ? 200
        : screenIndex === 4
        ? 155
        : screenIndex === 5
        ? 150
        : screenIndex === 3
        ? 140
        : 100;

    const interval = setInterval(() => {
      setAnimTick((prev) => (prev + 1) % maxTicks);
    }, screenIndex === 4 ? 120 : 45);

    return () => clearInterval(interval);
  }, [screenIndex]);

  // Synchronized demonstration step logic
  useEffect(() => {
    if (screenIndex === -1) return;

    // SLIDE 1: THE GOAL (Continuous path overview from Start to Destination)
    if (screenIndex === 0) {
      setSelectedTileKey(null);
        setDirReversed(false);
      setActiveBtn(null);
      setShowCompletionFeedback(false);
      setHighlightTimer(false);

      const t = (animTick % 100) / 100;
      setCursorPos({
        x: 5 + t * 90,
        y: 50,
        opacity: 0.8,
        clicking: false,
      });
    }

    // SLIDE 2: SELECT TILE (Cursor moves to Right-Side Tile T12 and clicks)
    else if (screenIndex === 1) {
      if (animTick < 28) {
        const progress = animTick / 28;
        setCursorPos({
          x: 55 + progress * 28, // glides to T12 (83%, 50%)
          y: 72 - progress * 22,
          opacity: Math.min(progress * 2, 1),
          clicking: false,
        });
        setSelectedTileKey(null);
      } else if (animTick < 38) {
        setCursorPos({ x: 83, y: 50, opacity: 1, clicking: true });
        setSelectedTileKey("t12");
      } else {
        setCursorPos({ x: 83, y: 50, opacity: 1, clicking: false });
        setSelectedTileKey("t12");
      }
    }

    // SLIDE 3: ROTATE TILE
    // T12 rotates exactly once, then T21 rotates three times.
    else if (screenIndex === 2) {
      if (animTick < 25) {
        const progress = animTick / 25;
        setSelectedTileKey("t12");
        setCursorPos({ x: 83 - progress * 43, y: 50 + progress * 58, opacity: 1, clicking: false });
        setActiveBtn(null);
        setT12RotateDeg(0);
        setT21RotateDeg(0);
      } else if (animTick < 35) {
        setSelectedTileKey("t12");
        setCursorPos({ x: 50, y: 118, opacity: 1, clicking: true });
        setActiveBtn("rotate");
        setT12RotateDeg(90);
        setT21RotateDeg(0);
      } else if (animTick < 70) {
        setSelectedTileKey("t12");
        setCursorPos({ x: 50, y: 118, opacity: 1, clicking: false });
        setActiveBtn(null);
        setT12RotateDeg(90);
        setT21RotateDeg(0);
      } else if (animTick < 95) {
        const progress = (animTick - 70) / 25;
        setSelectedTileKey("t21");
        setCursorPos({ x: 50, y: 118 - progress * 5, opacity: 1, clicking: false });
        setActiveBtn(null);
        setT12RotateDeg(90);
        setT21RotateDeg(0);
      } else if (animTick < 105) {
        setSelectedTileKey("t21");
        setCursorPos({ x: 50, y: 118, opacity: 1, clicking: true });
        setActiveBtn("rotate");
        setT12RotateDeg(90);
        setT21RotateDeg(90);
      } else if (animTick < 120) {
        setSelectedTileKey("t21");
        setCursorPos({ x: 50, y: 118, opacity: 1, clicking: false });
        setActiveBtn(null);
        setT12RotateDeg(90);
        setT21RotateDeg(90);
      } else if (animTick < 130) {
        setSelectedTileKey("t21");
        setCursorPos({ x: 50, y: 118, opacity: 1, clicking: true });
        setActiveBtn("rotate");
        setT12RotateDeg(90);
        setT21RotateDeg(180);
      } else if (animTick < 145) {
        setSelectedTileKey("t21");
        setCursorPos({ x: 50, y: 118, opacity: 1, clicking: false });
        setActiveBtn(null);
        setT12RotateDeg(90);
        setT21RotateDeg(180);
      } 
    }

    // SLIDE 4: CHANGE ROUTE DIRECTION
    // Demonstrate direction changes sequentially: first T12, then T21.
    else if (screenIndex === 3) {
      if (animTick < 20) {
        // Move the cursor to T12 first.
        const progress = animTick / 20;
        setSelectedTileKey(null);
        setCursorPos({
          x: 83,
          y: 50,
          opacity: 1,
          clicking: false,
        });
        setActiveBtn(null);
        setDirReversed(false);
        setT12DirReversed(false);
        setT21DirReversed(false);
      } else if (animTick < 30) {
        // Click T12 so the T12 tile becomes selected.
        setSelectedTileKey("t12");
        setCursorPos({ x: 83, y: 50, opacity: 1, clicking: true });
        setActiveBtn(null);
        setDirReversed(false);
        setT12DirReversed(false);
        setT21DirReversed(false);
      } else if (animTick < 40) {
        // Move the cursor from T12 to the Direction button.
        const progress = (animTick - 30) / 10;
        setSelectedTileKey("t12");
        setCursorPos({
          x: 50 + progress * 15,
          y: 118,
          opacity: 1,
          clicking: false,
        });
        setActiveBtn(null);
        setDirReversed(false);
        setT12DirReversed(false);
        setT21DirReversed(false);
      } else if (animTick < 50) {
        // Click the Direction button while T12 is selected.
        setSelectedTileKey("t12");
        setCursorPos({ x: 65, y: 118, opacity: 1, clicking: true });
        setActiveBtn("dir");
        setDirReversed(true);
        setT12DirReversed(true);
        setT21DirReversed(false);
      } else if (animTick < 65) {
        // Hold T12 with its changed arrow direction.
        setSelectedTileKey("t12");
        setCursorPos({ x: 65, y: 118, opacity: 1, clicking: false });
        setActiveBtn(null);
        setDirReversed(true);
        setT12DirReversed(true);
        setT21DirReversed(false);
      } else if (animTick < 80) {
        // Deselect T12 and move the cursor to T21.
        const progress = (animTick - 65) / 15;
        setSelectedTileKey(null);
        setCursorPos({
          x: 65 - progress * 15,
          y: 80,
          opacity: 1,
          clicking: false,
        });
        setActiveBtn(null);
        setDirReversed(false);
        setT12DirReversed(true);
        setT21DirReversed(false);
      } else if (animTick < 90) {
        // Click T21 so the T21 tile becomes selected. T12 stays changed.
        setSelectedTileKey("t21");
        setCursorPos({ x: 60, y: 118, opacity: 1, clicking: true });
        setActiveBtn(null);
        setDirReversed(false);
        setT12DirReversed(true);
        setT21DirReversed(false);
      } else if (animTick < 100) {
        // Move the cursor from T21 to the Direction button.
        const progress = (animTick - 90) / 10;
        setSelectedTileKey("t21");
        setCursorPos({
          x: 55 + progress * 15,
          y: 118,
          opacity: 1,
          clicking: false,
        });
        setActiveBtn(null);
        setDirReversed(false);
        setT12DirReversed(true);
        setT21DirReversed(false);
      } else if (animTick < 110) {
        // Click the Direction button while T21 is selected.
        setSelectedTileKey("t21");
        setCursorPos({ x: 65, y: 118, opacity: 1, clicking: true });
        setActiveBtn("dir");
        setDirReversed(true);
        setT12DirReversed(true);
        setT21DirReversed(true);
      } else {
        // Final state: both tiles keep their own changed directions.
        setSelectedTileKey("t21");
        setCursorPos({ x: 65, y: 118, opacity: 1, clicking: false });
        setActiveBtn(null);
        setDirReversed(false);
        setT12DirReversed(true);
        setT21DirReversed(true);
      }
    }

    // SLIDE 5: DIRECTION BUTTON BEHAVIOR
    // Keep the exact existing Slide 5 board. Only the arrow directions
    // inside T11 change, following the game's CROSS direction cycle.
    else if (screenIndex === 4) {
      setDirReversed(false);
      setT12DirReversed(false);
      setT21DirReversed(false);
      if (animTick < 15) {
        setSelectedTileKey(null);
        setActiveBtn(null);
        setCursorPos({ x: 83, y: 50, opacity: 0, clicking: false });
      } else if (animTick < 25) {
        // Select T11.
        setSelectedTileKey("t11");
        setActiveBtn(null);
        setCursorPos({ x: 50, y: 50, opacity: 1, clicking: true });
      } else if (animTick < 35) {
        // Move to the Direction button.
        const progress = (animTick - 25) / 10;
        setSelectedTileKey("t11");
        setActiveBtn(null);
        setCursorPos({
          x: 50 + progress * 15,
          y: 50 + progress * 68,
          opacity: 1,
          clicking: false,
        });
      } else {
        // Direction button cycles CROSS states:
        // 0 -> 1 -> ... -> 11 -> 0.
        setSelectedTileKey("t11");
        setCursorPos({
          x: 65,
          y: 118,
          opacity: 1,
          clicking: (animTick - 35) % 10 < 4,
        });
        setActiveBtn((animTick - 35) % 10 < 4 ? "dir" : null);
      }
    }
    // SLIDE 6: CHECKMARK / COMPLETE
    // Show the same board as Slide 5. The cursor points to the checkmark,
    // clicks it, and then a rocket travels along the valid route to the
    // destination.
    else if (screenIndex === 5) {
      setSelectedTileKey(null);
      setDirReversed(false);
      setT12DirReversed(false);
      setT21DirReversed(false);
      setHighlightTimer(false);

      if (animTick < 25) {
        // Move the pointer to the Check button.
        const progress = animTick / 25;
        setCursorPos({
          x: 67 + progress * 10,
          y: 78 + progress * 38,
          opacity: 1,
          clicking: false,
        });
        setActiveBtn(null);
        setRocketState({ left: -10, top: 50, angle: 0 });
        setShowCompletionFeedback(false);
      } else if (animTick < 40) {
        // Click the Check button.
        setCursorPos({
          x: 75,
          y: 118,
          opacity: 1,
          clicking: true,
        });
        setActiveBtn("check");
        setRocketState({ left: -10, top: 50, angle: 0 });
        setShowCompletionFeedback(false);
      } else {
        // After the click, keep the pointer on the checkmark and animate
        // the rocket from the valid START route to the destination.
        setCursorPos({
          x: 75,
          y: 118,
          opacity: 1,
          clicking: false,
        });
        setActiveBtn(null);
        setShowCompletionFeedback(true);

        // Rocket follows mapped board route visually 
        const progress = Math.min(1, (animTick - 40) / 100);

        if (progress < 0.15) {
          setRocketState({ left: -10 + (progress / 0.15) * 26.6, top: 50, angle: 0 });
        } else if (progress < 0.35) {
          setRocketState({ left: 16.6, top: 50 + ((progress - 0.15) / 0.20) * 33.3, angle: 90 });
        } else if (progress < 0.70) {
          setRocketState({ left: 16.6 + ((progress - 0.35) / 0.35) * 66.7, top: 83.3, angle: 0 });
        } else if (progress < 0.85) {
          setRocketState({ left: 83.3, top: 83.3 - ((progress - 0.70) / 0.15) * 33.3, angle: -90 });
        } else {
          setRocketState({ left: 83.3 + ((progress - 0.85) / 0.15) * 26.7, top: 50, angle: 0 });
        }
      }
    }

    // SLIDE 7: MOVES AND TIMER (Timer pulse & highlight)
    else if (screenIndex === 6) {
      setSelectedTileKey(null);
      setActiveBtn(null);
      setShowCompletionFeedback(false);
      setHighlightTimer(true);
      setCursorPos({ x: 26, y: 108, opacity: 0.9, clicking: false });
      setRocketState({ left: -10, top: 50, angle: 0 }); 
    }
  }, [screenIndex, animTick]);

  // Handlers for Navigation
  const handlePrev = () => {
    if (screenIndex > 0) {
      setScreenIndex((prev) => prev - 1);
    } else if (screenIndex === 0) {
      setScreenIndex(-1);
    }
  };

  const handleNext = () => {
    if (screenIndex < TUTORIAL_STEPS.length - 1) {
      setScreenIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  // ==========================================================================
  // 1. INTRODUCTION SCREEN
  // ==========================================================================
  if (screenIndex === -1) {
    return (
      <div className="w-full min-h-screen flex items-start justify-center bg-white text-black select-none px-2 sm:px-4 py-2 sm:pt-10">
        <div className="w-full max-w-[650px] min-h-[580px] sm:min-h-[650px] flex flex-col border border-[#b8b8b8] rounded-[6px] overflow-hidden bg-[#f3f3f3] relative">
          {/* Header */}
          <div className="w-full h-[48px] bg-black flex items-center justify-between px-3 sm:px-5 shrink-0">
            <span className="text-white text-xs sm:text-base font-semibold tracking-tight">
              Path Finder - Full Mock Test
            </span>
            <span className="text-white text-xs sm:text-base font-semibold tracking-tight text-white/80">
              Tutorial
            </span>
          </div>

          {/* Intro Body */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Practice Exercise
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed max-w-lg">
              <p>
                This practice exercise will provide you with instructions and
                practice items for a task designed to measure image rotation
                ability.
              </p>
              <p>
                Please take the time to read the instructions carefully and use
                the practice items to familiarize yourself with the task.
              </p>
            </div>

            <div className="pt-4 w-full flex justify-center">
              <button
                type="button"
                onClick={() => setScreenIndex(0)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-black text-white text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 2. TUTORIAL DEMONSTRATION SLIDES (Slides 1 to 7)
  // ==========================================================================
  const currentStepData = TUTORIAL_STEPS[screenIndex];
  const isLastSlide = screenIndex === TUTORIAL_STEPS.length - 1;
  const demoTiles = screenIndex === 3 ? getTutorial4Board() : screenIndex === 4 || screenIndex === 5 || screenIndex === 6 ? getTutorial5Board() : getFixedReferenceBoard();

  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-white text-black select-none px-2 sm:px-4 py-2 sm:pt-10">
      <div className="w-full max-w-[650px] min-h-[580px] sm:min-h-[650px] flex flex-col border border-[#b8b8b8] rounded-[6px] overflow-hidden bg-[#f3f3f3] relative">
        {/* HEADER */}
        <div className="w-full h-[48px] bg-black flex items-center justify-between px-3 sm:px-5 shrink-0">
          <span className="text-white text-xs sm:text-base font-semibold tracking-tight">
            Path Finder - Full Mock Test
          </span>
          <span className="text-white text-xs sm:text-base font-semibold tracking-tight">
            Tutorial ({screenIndex + 1} of {TUTORIAL_STEPS.length})
          </span>
        </div>

        {/* GAME AREA (EXACT SAME DIMENSIONS AS REAL GAME) */}
        <div className="flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-4 py-4 sm:py-8 relative">
          {/* =========================================================
              LAYER 1: TOP WHITE INSTRUCTION PANEL (ABSOLUTE OVERLAY)
              ========================================================= */}
          <div className="absolute top-2 sm:top-3 z-30 w-[calc(100%-24px)] max-w-[480px] bg-white rounded-md border border-slate-300 shadow-md px-4 py-3 flex flex-col items-center text-center select-none transition-all duration-200">
            {/* INSTRUCTION TEXT */}
            <div className="w-full text-slate-800 text-xs sm:text-[13px] font-medium leading-snug min-h-[38px] flex flex-col items-center justify-center px-1">
              <p>{currentStepData.instruction}</p>
              {currentStepData.subText && (
                <p className="mt-1 text-slate-600 text-[11px] sm:text-xs">
                  {currentStepData.subText}
                </p>
              )}
            </div>

            {/* NAVIGATION BAR (PREV ARROW, PROGRESS DOTS, NEXT ARROW) */}
            <div className="w-full flex items-center justify-between pt-2 mt-1.5 border-t border-slate-100 px-1">
              {/* Prev Button: NOT rendered on Slide 1 */}
              {screenIndex > 0 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous instruction"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-700 border border-slate-300 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-7 h-7" />
              )}

              {/* Tutorial Progress Dots */}
              <div
                className="flex items-center gap-1.5"
                aria-label="Tutorial progress"
              >
                {TUTORIAL_STEPS.map((step, idx) => (
                  <button
                    key={step.slideNumber}
                    type="button"
                    onClick={() => setScreenIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all rounded-full ${
                      idx === screenIndex
                        ? "w-3.5 h-1.5 bg-black"
                        : "w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              {/* Next Button */}
              {isLastSlide ? (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Start Full Mock Test"
                  className="h-7 px-2.5 rounded-full bg-black text-white text-[11px] font-bold tracking-wide uppercase flex items-center gap-1 hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <span>Start</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next instruction"
                  className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* =========================================================
              LAYER 2: DEMONSTRATION AREA (EXACT POSITION UNDERNEATH)
              ========================================================= */}
          <div className="relative shrink-0 w-full flex items-center justify-center">
            {/* BOARD WITH START & DESTINATION */}
            <div className="relative flex items-center justify-center py-2 px-8 sm:px-10 w-full max-w-[458px]">
              {/* Destination Icon on the Right (Row 4 / Middle-Right) */}
              <div
                className="absolute right-0.5 sm:right-0 -translate-y-1/2 flex items-center pl-1 pointer-events-none z-10"
                style={{ top: "50%" }}
              >
                <svg
                  viewBox="0 0 40 40"
                  className="w-7 h-7 sm:w-8 sm:h-8 text-slate-800 fill-current"
                  aria-label="Destination position"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <circle cx="20" cy="20" r="7" />
                  <circle cx="16" cy="16" r="2.5" className="fill-white" />
                </svg>
              </div>

              {/* 3x3 Tile Board (9x9 logical cells) */}
              <div className="relative w-full max-w-[378px] aspect-square grid grid-cols-3 grid-rows-3 border-[3px] border-[#9ca3af] bg-white shadow-sm select-none">
                {/* Start Rocket / animated valid-route rocket on Slide 6 */}
                {screenIndex === 5 ? (
                  <div
                    className="absolute flex items-center pointer-events-none z-40"
                    style={{
                      left: `${rocketState.left}%`,
                      top: `${rocketState.top}%`,
                      transform: `translate(-50%, -50%) rotate(${rocketState.angle}deg)`,
                    }}
                  >
                    <TutorialRocket />
                  </div>
                ) : (
                  <div
                    className="absolute -left-8 sm:-left-10 -translate-y-1/2 flex items-center pointer-events-none z-10"
                    style={{ top: "50%" }}
                  >
                    <TutorialRocket />
                  </div>
                )}

                {/* Tiles */}
                {demoTiles.map((tile) => {
                  const isSelected = selectedTileKey === tile.id;
                  const isT12 = tile.id === "t12";
                  const isT21 = tile.id === "t21";
                  const isTargetTile = isT12 || isT21;

                  return (
                    <div
                      key={tile.id}
                      className={`relative w-full h-full aspect-square grid grid-cols-3 grid-rows-3 select-none transition-all duration-200 border border-[#9ca3af] ${
                        isSelected
                          ? "ring-2 ring-yellow-400 border border-yellow-400 z-20"
                          : ""
                      }`}
                      style={{
                        // Tutorial 3 uses visual CSS rotation.
                        // Tutorial 4 already contains the physically rotated T12
                        // cell/arrow state, so it must NOT receive another rotation.
                        transform:
                          screenIndex === 2 && isT12 && t12RotateDeg !== 0
                            ? `rotate(${t12RotateDeg}deg)`
                            : screenIndex === 2 && isT21 && t21RotateDeg !== 0
                            ? `rotate(${t21RotateDeg}deg)`
                            : undefined,
                        transition: "transform 0.4s ease-in-out",
                      }}
                    >
                      {tile.cells.map((row, rIdx) =>
                        row.map((cell, cIdx) => {
                          let finalArrow = cell.arrow;
                          const tileDirReversed =
                            tile.id === "t12"
                              ? t12DirReversed
                              : tile.id === "t21"
                              ? t21DirReversed
                              : false;

                          if (tileDirReversed && cell.active) {
                            if (cell.arrow === "LEFT") finalArrow = "RIGHT";
                            else if (cell.arrow === "RIGHT") finalArrow = "LEFT";
                            else if (cell.arrow === "UP") finalArrow = "DOWN";
                            else if (cell.arrow === "DOWN") finalArrow = "UP";
                            else if (cell.arrow === "BOTTOM_LEFT")
                              finalArrow = "TOP_RIGHT";
                          }

                          // Slide 5 only: T11 is a CROSS.
                          // The real game cycles its direction state as
                          // 0 -> 1 -> ... -> 11 -> 0. The tile geometry stays
                          // exactly the same; only the arrow directions change.
                          if (screenIndex === 4 && tile.id === "t11" && cell.active) {
                            // directionStep is the actual game flipState.
                            // The real CROSS code maps flipState through:
                            // [0, 2, 1, 3, 4, 8, 5, 10, 6, 11, 7, 9]
                            const directionStep =
                              Math.floor(Math.max(0, animTick - 35) / 10) % 12;

                            const crossDirectionStates: Record<
                              number,
                              Record<string, ArrowDir>
                            > = {
                              // flipState 0 -> visual mode 0
                              0: {
                                "0-1": "UP",
                                "1-1": "UP",
                                "2-1": "UP",
                              },

                              // flipState 1 -> visual mode 2
                              1: {
                                "0-1": "DOWN",
                                "1-1": "DOWN",
                                "2-1": "DOWN",
                              },

                              // flipState 2 -> visual mode 1
                              2: {
                                "1-0": "RIGHT",
                                "1-1": "RIGHT",
                                "1-2": "RIGHT",
                              },

                              // flipState 3 -> visual mode 3
                              3: {
                                "1-0": "LEFT",
                                "1-1": "LEFT",
                                "1-2": "LEFT",
                              },

                              // flipState 4 -> visual mode 4
                              4: {
                                "0-1": "UP",
                                "1-0": "RIGHT",
                                "1-1": "TOP_RIGHT",
                              },

                              // flipState 5 -> visual mode 8
                              5: {
                                "0-1": "DOWN",
                                "1-0": "LEFT",
                                "1-1": "BOTTOM_LEFT",
                              },

                              // flipState 6 -> visual mode 5
                              6: {
                                "0-1": "DOWN",
                                "1-1": "BOTTOM_RIGHT",
                                "1-2": "RIGHT",
                              },

                              // flipState 7 -> visual mode 10
                              7: {
                                "1-1": "TOP_RIGHT",
                                "1-2": "RIGHT",
                                "2-1": "UP",
                              },

                              // flipState 8 -> visual mode 6
                              8: {
                                "1-1": "BOTTOM_LEFT",
                                "1-2": "LEFT",
                                "2-1": "DOWN",
                              },

                              // flipState 9 -> visual mode 11
                              9: {
                                "1-0": "RIGHT",
                                "1-1": "BOTTOM_RIGHT",
                                "2-1": "DOWN",
                              },

                              // flipState 10 -> visual mode 7
                              10: {
                                "1-0": "LEFT",
                                "1-1": "TOP_LEFT",
                                "2-1": "UP",
                              },

                              // flipState 11 -> visual mode 9
                              11: {
                                "0-1": "UP",
                                "1-1": "TOP_LEFT",
                                "1-2": "LEFT",
                              },
                            };

                            // Explicitly clear arrows on active cells that
                            // have no arrow in the current CROSS state.
                            finalArrow =
                              crossDirectionStates[directionStep][
                                `${rIdx}-${cIdx}`
                              ];
                          }

                          const angle = finalArrow
                            ? ARROW_ANGLES[finalArrow]
                            : 0;

                          return (
                            <div
                              key={`${tile.id}-${rIdx}-${cIdx}`}
                              className={`w-full h-full aspect-square border border-[#e5e7eb] flex items-center justify-center select-none ${
                                cell.active
                                  ? isSelected
                                    ? "bg-[#757575] text-white ring-2 ring-yellow-400 z-10 shadow-sm"
                                    : "bg-[#757575] text-white"
                                  : "bg-white"
                              }`}
                            >
                              {cell.active && finalArrow && (
                                <svg
                                  viewBox="0 0 24 24"
                                  className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-white fill-none"
                                  style={{ transform: `rotate(${angle}deg)` }}
                                >
                                  <path
                                    d="M5 12h11M13 7l5 5-5 5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}

                {/* Animated Cursor Overlay for Demonstrations */}
                <div
                  className="absolute pointer-events-none z-30 transition-all duration-150 ease-out"
                  style={{
                    left: `${cursorPos.x}%`,
                    top: `${cursorPos.y}%`,
                    opacity: cursorPos.opacity,
                    transform: `translate(-20%, -20%) scale(${
                      cursorPos.clicking ? 0.85 : 1
                    })`,
                  }}
                >
                  <DemoCursor clicking={cursorPos.clicking} />
                </div>
              </div>
            </div>

            {/* Checkmark Completion Feedback Overlay */}
            {showCompletionFeedback && (
              <div className="absolute inset-0 z-40 flex items-start justify-center pt-4">
                <div className="w-[calc(100%-24px)] max-w-[280px] rounded-md border border-slate-300 bg-white px-5 py-3 text-center shadow-lg flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">
                    Valid route - well done!
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CONTROLS BAR (TIMER, ROTATE, DIRECTION, CHECK) */}
          <div className="flex flex-col items-center gap-3 pt-6">
            <div className="flex items-center justify-center gap-6 sm:gap-8">
              {/* Timer Control */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold select-none transition-all ${
                  highlightTimer
                    ? "ring-2 ring-yellow-400 border-yellow-400 bg-yellow-50 text-slate-900 shadow-md scale-105"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                <span>04:00</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* 1. ROTATE */}
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                    activeBtn === "rotate"
                      ? "bg-yellow-500 text-black scale-95 shadow-md"
                      : selectedTileKey
                      ? "bg-[#333333] text-white"
                      : "bg-[#333333]/50 text-white/40"
                  }`}
                >
                  <RotateCw className="w-5 h-5 stroke-[2.2]" />
                </div>

                {/* 2. DIRECTION */}
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                    activeBtn === "dir"
                      ? "bg-yellow-500 text-black scale-95 shadow-md"
                      : selectedTileKey
                      ? "bg-[#333333] text-white"
                      : "bg-[#333333]/50 text-white/40"
                  }`}
                >
                  <ArrowLeftRight className="w-5 h-5 stroke-[2.2]" />
                </div>

                {/* 3. CHECK */}
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                    activeBtn === "check"
                      ? "bg-green-600 text-white scale-95 shadow-md"
                      : "bg-[#333333] text-white"
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Moves Counter */}
            <div
              className={`text-xs font-medium select-none transition-all ${
                highlightTimer
                  ? "text-slate-900 font-bold scale-105"
                  : "text-slate-500"
              }`}
            >
              Moves: 0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER SVG COMPONENTS
// ============================================================================

function DemoCursor({ clicking }: { clicking?: boolean }) {
  return (
    <div className="relative">
      {clicking && (
        <span className="absolute -inset-2 rounded-full bg-yellow-400/50 animate-ping" />
      )}
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 text-black fill-black drop-shadow-md"
      >
        <path
          d="M3 2l11 11-4.5 1 3 6-2.5 1-3-6L3 19V2z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function TutorialRocket() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1100 1014"
      className="w-8 h-8 sm:w-10 sm:h-10"
      aria-label="Start position"
    >
      <path
        d="M 0 311 C 85 315, 190 327, 343 350 C 405 359, 510 368, 620 382 C 735 397, 825 412, 856 442 C 874 459, 883 477, 883 493 C 883 510, 874 528, 856 545 C 825 575, 735 590, 620 605 C 510 619, 405 629, 343 638 C 300 645, 270 667, 238 700 L 130 816 C 112 835, 90 846, 66 846 L 0 846 Z"
        fill="#000000"
      />
      <path
        d="M 0 113 L 68 113 C 91 113, 111 123, 128 140 L 348 347 C 330 347, 313 344, 295 340 L 0 310 Z"
        fill="#000000"
      />
      <path
        d="M 0 846 L 68 846 C 91 846, 111 836, 128 819 L 348 638 C 330 638, 313 641, 295 645 L 0 675 Z"
        fill="#000000"
      />
      <path d="M 10 159 L 32 159 L 32 310 L 10 307 Z" fill="#ffffff" />
      <path
        d="M 48 159 L 65 159 C 78 159, 91 165, 101 175 L 186 302 C 194 314, 186 331, 171 331 C 130 328, 91 322, 48 316 Z"
        fill="#ffffff"
      />
      <path d="M 10 671 L 32 674 L 32 822 L 10 822 Z" fill="#ffffff" />
      <path
        d="M 48 669 C 91 663, 130 657, 171 650 C 186 648, 194 665, 186 677 L 101 802 C 91 812, 78 818, 65 818 L 48 818 Z"
        fill="#ffffff"
      />
      <path
        d="M 40 483 L 552 483 L 552 506 L 40 506 Z"
        fill="#ffffff"
      />
      <path
        d="M 617 439 C 604 439, 594 447, 592 462 L 592 516 C 594 531, 604 545, 617 545 L 720 533 C 733 531, 742 522, 742 509 L 742 475 C 742 462, 733 453, 720 451 Z"
        fill="#ffffff"
      />
      <path
        d="M 0 402 C 17 402, 28 412, 28 428 L 28 571 C 28 587, 17 597, 0 597 Z"
        fill="#ffffff"
      />
    </svg>
  );
}



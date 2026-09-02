import { create } from "zustand";
import { GameSession, PracticeConfig } from "@/lib/games/core/types";
import { SessionController } from "@/lib/games/core/session";
import { gameRegistry } from "@/lib/games/core/registry";
import { AssessmentTimerEngine } from "@/lib/games/core/timer";

interface GameSessionState {
  currentSession: GameSession | null;
  controller: SessionController | null;
  timer: AssessmentTimerEngine | null;
  
  initializeSession: (sessionId: string, config: PracticeConfig, seed: string, onTimerComplete?: () => void) => void;
  startSession: () => void;
  recordAction: (payload: unknown, responseTimeMs: number) => boolean | undefined;
  advanceQuestion: () => void;
  abortSession: () => void;
  
  // Timer sync for UI
  remainingSeconds: number;
  syncTimer: () => void;
}

export const useGameSessionStore = create<GameSessionState>((set, get) => ({
  currentSession: null,
  controller: null,
  timer: null,
  remainingSeconds: 0,

  initializeSession: (sessionId, config, seed, onTimerComplete?) => {
    const gameDef = gameRegistry.getGame(config.gameId);
    const controller = new SessionController(sessionId, config, gameDef, seed);
    
    // Create timer
    const timer = new AssessmentTimerEngine(config.timeLimitSeconds, () => {
      if (onTimerComplete) {
        onTimerComplete();
      } else {
        // Default on timeout
        const state = get();
        if (state.controller) {
          state.controller.transitionTo("TIMEOUT");
          set({ currentSession: state.controller.getSession(), remainingSeconds: 0 });
        }
      }
    });

    set({ 
      controller, 
      currentSession: controller.getSession(),
      timer,
      remainingSeconds: config.timeLimitSeconds
    });
  },

  startSession: () => {
    const { controller, timer } = get();
    if (controller && timer) {
      if (controller.getSession().status === "IDLE") {
        controller.transitionTo("READY");
      }
      controller.transitionTo("PLAYING");
      timer.start();
      
      // Start a UI sync interval (React specific state syncing)
      // Actual source of truth is timer engine timestamps.
      const syncInterval = setInterval(() => {
        const currentTimer = get().timer;
        if (currentTimer) {
          set({ remainingSeconds: currentTimer.getRemainingSeconds() });
        } else {
          clearInterval(syncInterval);
        }
      }, 100); // 10fps UI update is enough
      
      // Store the interval ID on the window object just for cleanup, or in a ref. 
      // For global store, a hidden property is fine, but we'll clean up when timer stops.
      
      set({ currentSession: controller.getSession() });
    }
  },

  recordAction: (payload, responseTimeMs) => {
    const { controller } = get();
    if (controller) {
      const action = controller.recordAction(payload, responseTimeMs);
      
      const updatedSession = controller.getSession();
      
      if (["COMPLETED", "TIMEOUT", "FAILED", "ABORTED"].includes(updatedSession.status)) {
        get().timer?.stop();
      }
      
      set({ currentSession: updatedSession });
      return action.valid;
    }
    return undefined;
  },

  advanceQuestion: () => {
    const { controller } = get();
    if (controller) {
      controller.advanceItem();
      set({ currentSession: controller.getSession() });
    }
  },

  abortSession: () => {
    const { controller, timer } = get();
    if (controller) {
      controller.transitionTo("ABORTED");
      timer?.stop();
      set({ currentSession: controller.getSession(), remainingSeconds: 0 });
    }
  },

  syncTimer: () => {
    const { timer } = get();
    if (timer) {
      set({ remainingSeconds: timer.getRemainingSeconds() });
    }
  }
}));

import { 
  GameSession, 
  SessionStatus, 
  GameAction, 
  GameDefinition,
  PracticeConfig
} from "./types";

export class SessionController<TState = unknown, TActionPayload = unknown> {
  private session: GameSession<TState>;
  private gameDef: GameDefinition<unknown, TState, TActionPayload>;
  private config: PracticeConfig;

  constructor(
    sessionId: string,
    config: PracticeConfig,
    gameDef: GameDefinition<unknown, TState, TActionPayload>,
    seed: string
  ) {
    this.gameDef = gameDef;
    this.config = config;
    this.session = {
      sessionId,
      gameId: config.gameId,
      variantId: config.variantId,
      difficulty: config.difficulty,
      mode: config.mode,
      seed,
      status: "IDLE",
      startedAt: null,
      completedAt: null,
      currentItemIndex: 0,
      totalItems: config.itemCount,
      actions: [],
      gameState: gameDef.createInitialState(config, seed),
      metadata: {}
    };
  }

  getSession(): GameSession<TState> {
    return { ...this.session };
  }

  getConfig(): PracticeConfig {
    return this.config;
  }

  transitionTo(newStatus: SessionStatus): boolean {
    const current = this.session.status;
    
    // Define valid transitions
    const validTransitions: Record<SessionStatus, SessionStatus[]> = {
      IDLE: ["INTRO", "READY", "ABORTED"],
      INTRO: ["READY", "ABORTED"],
      READY: ["PLAYING", "ABORTED"],
      PLAYING: ["COMPLETED", "TIMEOUT", "ABORTED", "FAILED"],
      COMPLETED: [],
      TIMEOUT: [],
      ABORTED: [],
      FAILED: []
    };

    if (validTransitions[current].includes(newStatus)) {
      this.session.status = newStatus;
      
      if (newStatus === "PLAYING" && !this.session.startedAt) {
        this.session.startedAt = Date.now();
      } else if (["COMPLETED", "TIMEOUT", "ABORTED", "FAILED"].includes(newStatus)) {
        this.session.completedAt = Date.now();
      }
      return true;
    }
    
    throw new Error(`Invalid state transition from ${current} to ${newStatus}`);
  }

  recordAction(actionPayload: TActionPayload, timeMs: number): GameAction<TActionPayload> {
    if (this.session.status !== "PLAYING") {
      throw new Error("Cannot record action: Session is not in PLAYING state.");
    }

    // Guard against duplicate actions recorded for the same question itemIndex
    const existingAction = this.session.actions.find(
      (a) => a.itemIndex === this.session.currentItemIndex
    );
    if (existingAction) {
      return existingAction as GameAction<TActionPayload>;
    }

    const action: GameAction<TActionPayload> = {
      timestamp: Date.now(),
      type: "ACTION",
      itemIndex: this.session.currentItemIndex,
      payload: actionPayload,
      valid: false,
      responseTimeMs: timeMs
    };

    action.valid = this.gameDef.validateAction(this.session.gameState, action);
    this.session.actions.push(action);
    this.session.gameState = this.gameDef.applyAction(this.session.gameState, action);

    // Check completion implicitly upon action
    if (this.gameDef.isCompleted(this.session.gameState, this.session.currentItemIndex, this.session.totalItems)) {
      this.transitionTo("COMPLETED");
    }

    return action;
  }

  advanceItem(): void {
    if (this.session.status !== "PLAYING") {
      return;
    }
    if (this.session.currentItemIndex < this.session.totalItems - 1) {
      this.session.currentItemIndex++;
    } else {
      this.transitionTo("COMPLETED");
    }
  }
}

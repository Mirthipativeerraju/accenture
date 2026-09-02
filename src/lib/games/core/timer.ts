export interface TimeProvider {
  now(): number;
}

export const defaultTimeProvider: TimeProvider = {
  now: () => Date.now(),
};

type TimerCallback = () => void;

export class AssessmentTimerEngine {
  private startTimeMs: number | null = null;
  private durationMs: number;
  private timeProvider: TimeProvider;
  private animationFrameId: number | null = null;
  private onComplete: TimerCallback | null = null;
  private isRunning: boolean = false;
  private stoppedAtMs: number | null = null;

  constructor(
    durationSeconds: number, 
    onComplete?: TimerCallback,
    timeProvider: TimeProvider = defaultTimeProvider
  ) {
    this.durationMs = durationSeconds * 1000;
    this.onComplete = onComplete || null;
    this.timeProvider = timeProvider;
  }

  start(): void {
    if (this.isRunning) return;

    if (this.startTimeMs === null) {
      this.startTimeMs = this.timeProvider.now();
    } else if (this.stoppedAtMs !== null) {
      // Resume logic
      const pausedDuration = this.timeProvider.now() - this.stoppedAtMs;
      this.startTimeMs += pausedDuration;
      this.stoppedAtMs = null;
    }
    
    this.isRunning = true;
    this.tick();
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.stoppedAtMs = this.timeProvider.now();
    if (this.animationFrameId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  reset(): void {
    this.stop();
    this.startTimeMs = null;
    this.stoppedAtMs = null;
  }

  getElapsedTimeMs(): number {
    if (this.startTimeMs === null) return 0;
    
    const referenceTime = this.stoppedAtMs !== null ? this.stoppedAtMs : this.timeProvider.now();
    return Math.max(0, referenceTime - this.startTimeMs);
  }

  getRemainingTimeMs(): number {
    const elapsed = this.getElapsedTimeMs();
    return Math.max(0, this.durationMs - elapsed);
  }

  getRemainingSeconds(): number {
    return Math.ceil(this.getRemainingTimeMs() / 1000);
  }

  private tick = () => {
    if (!this.isRunning) return;

    if (this.getRemainingTimeMs() <= 0) {
      this.isRunning = false;
      if (this.onComplete) {
        this.onComplete();
      }
      return;
    }

    if (typeof requestAnimationFrame !== 'undefined') {
      this.animationFrameId = requestAnimationFrame(this.tick);
    } else if (typeof setTimeout !== 'undefined') {
      // Fallback for non-browser environments like tests
      setTimeout(this.tick, 100);
    }
  };
}

import { GameSession, GameResult } from "./types";

export interface PersistenceProvider {
  saveSession(session: GameSession): void;
  loadSession(sessionId: string): GameSession | null;
  deleteSession(sessionId: string): void;
  saveResult(result: GameResult): void;
  loadResults(): GameResult[];
  saveLatestResult(variantId: string, result: GameResult): void;
  getLatestResult(variantId: string): GameResult | null;
  clearLatestResult(variantId: string): void;
}

const STORAGE_PREFIX = "aptitude-simulator:v1:";

export class LocalPersistence implements PersistenceProvider {
  
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  saveSession(session: GameSession): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}session:${session.sessionId}`, JSON.stringify(session));
    } catch (e) {
      console.warn("Failed to save session to local storage", e);
    }
  }

  loadSession(sessionId: string): GameSession | null {
    if (!this.isAvailable()) return null;
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn("Failed to load session from local storage", e);
      return null;
    }
  }

  deleteSession(sessionId: string): void {
    if (!this.isAvailable()) return;
    localStorage.removeItem(`${STORAGE_PREFIX}session:${sessionId}`);
  }

  saveResult(result: GameResult): void {
    if (!this.isAvailable()) return;
    try {
      const results = this.loadResults();
      results.push(result);
      localStorage.setItem(`${STORAGE_PREFIX}results`, JSON.stringify(results));
    } catch (e) {
      console.warn("Failed to save result to local storage", e);
    }
  }

  loadResults(): GameResult[] {
    if (!this.isAvailable()) return [];
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}results`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Failed to load results from local storage", e);
      return [];
    }
  }

  private isSessionAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  saveLatestResult(variantId: string, result: GameResult): void {
    if (!this.isSessionAvailable()) return;
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}latest_result:${variantId}`, JSON.stringify(result));
    } catch (e) {
      console.warn("Failed to save latest result to session storage", e);
    }
  }

  getLatestResult(variantId: string): GameResult | null {
    if (!this.isSessionAvailable()) return null;
    try {
      const data = sessionStorage.getItem(`${STORAGE_PREFIX}latest_result:${variantId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  clearLatestResult(variantId: string): void {
    if (this.isSessionAvailable()) {
      try {
        sessionStorage.removeItem(`${STORAGE_PREFIX}latest_result:${variantId}`);
      } catch (e) {
        // ignore
      }
    }
    if (this.isAvailable()) {
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}latest_result:${variantId}`);
      } catch (e) {
        // ignore
      }
    }
  }
}

export const persistence = new LocalPersistence();

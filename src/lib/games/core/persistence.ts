import { GameSession, GameResult } from "./types";

export interface PersistenceProvider {
  saveSession(session: GameSession): void;
  loadSession(sessionId: string): GameSession | null;
  deleteSession(sessionId: string): void;
  saveResult(result: GameResult): void;
  loadResults(): GameResult[];
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
}

export const persistence = new LocalPersistence();

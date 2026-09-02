import { GameDefinition, GameId } from "./types";

class GameRegistry {
  private games = new Map<GameId, GameDefinition<unknown, unknown, unknown>>();

  register(game: GameDefinition<unknown, unknown, unknown>): void {
    if (this.games.has(game.id)) {
      console.warn(`Game with id ${game.id} is already registered. Overwriting.`);
    }
    this.games.set(game.id, game);
  }

  getGame(id: GameId): GameDefinition<unknown, unknown, unknown> {
    const game = this.games.get(id);
    if (!game) {
      throw new Error(`Game with id ${id} not found in registry.`);
    }
    return game;
  }

  getAllGames(): GameDefinition<unknown, unknown, unknown>[] {
    return Array.from(this.games.values());
  }

  hasGame(id: GameId): boolean {
    return this.games.has(id);
  }

  clear(): void {
    this.games.clear();
  }
}

export const gameRegistry = new GameRegistry();

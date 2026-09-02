// Seeded Random Number Generator based on Mulberry32
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export class SeededRNG {
  private rng: () => number;

  constructor(seed: string) {
    const seedFunc = xmur3(seed);
    this.rng = mulberry32(seedFunc());
  }

  /**
   * Returns a random float between [0, 1)
   */
  next(): number {
    return this.rng();
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.rng() * (max - min + 1)) + min;
  }

  /**
   * Selects a random element from an array
   */
  randomChoice<T>(array: T[]): T {
    if (array.length === 0) throw new Error("Cannot select from empty array");
    return array[this.randomInt(0, array.length - 1)];
  }

  /**
   * Returns a shuffled copy of an array using Fisher-Yates
   */
  shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Returns true with the given probability [0, 1]
   */
  probability(p: number): boolean {
    return this.next() < p;
  }
}

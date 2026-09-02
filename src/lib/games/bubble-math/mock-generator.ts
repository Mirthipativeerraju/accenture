import { SeededRNG } from "../core/rng";
import { BubbleMathQuestion, MathExpression } from "./types";

/**
 * Clean floating point arithmetic to 1-2 decimal places
 */
function cleanNumber(num: number): number {
  return Math.round(num * 100) / 100;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Atomic Expression Generators (Single Operator / Value)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// 1. Single integer constant
function genSingleInteger(rng: SeededRNG, min: number, max: number, id: string): MathExpression {
  const val = rng.randomInt(min, max);
  return { id, display: `${val}`, value: val };
}

// 2. Single decimal constant (readable 1-decimal place values)
function genSingleDecimal(rng: SeededRNG, id: string): MathExpression {
  const choices = [1.5, 2.5, 2.6, 3.5, 3.7, 4.2, 4.5, 5.2, 6.2, 6.5, 7.4, 7.5, 8.5, 8.9, 9.5];
  const val = rng.randomChoice(choices);
  return { id, display: `${val}`, value: val };
}

// 3. Simple addition with distinct operands (1 operator)
function genAddition(rng: SeededRNG, minA: number, maxA: number, minB: number, maxB: number, id: string): MathExpression {
  let a = rng.randomInt(minA, maxA);
  let b = rng.randomInt(minB, maxB);
  if (a === b) {
    b = a + rng.randomChoice([-2, -1, 1, 2, 3]);
    if (b < 1) b = a + 2;
  }
  const val = a + b;
  return { id, display: `${a} + ${b}`, value: val };
}

// 4. Simple subtraction (guaranteed positive and non-zero, 1 operator)
function genSubtraction(rng: SeededRNG, minA: number, maxA: number, id: string): MathExpression {
  const a = rng.randomInt(minA, maxA);
  const diff = rng.randomInt(2, Math.max(3, a - 2));
  const b = a - diff;
  const val = diff;
  return { id, display: `${a} - ${b}`, value: val };
}

// 5. Multiplication with distinct operands (1 operator)
function genMultiplication(rng: SeededRNG, minA: number, maxA: number, minB: number, maxB: number, id: string): MathExpression {
  const a = rng.randomInt(minA, maxA);
  const b = rng.randomInt(minB, maxB);
  const val = a * b;
  return { id, display: `${a} × ${b}`, value: val };
}

// 6. Clean Division with whole quotient (1 operator)
function genDivision(rng: SeededRNG, minDiv: number, maxDiv: number, minQ: number, maxQ: number, id: string): MathExpression {
  const b = rng.randomInt(minDiv, maxDiv);
  const quotient = rng.randomInt(minQ, maxQ);
  const a = b * quotient;
  const val = quotient;
  return { id, display: `${a} ÷ ${b}`, value: val };
}

// 7. Chained arithmetic expression without parentheses (Rule 8: AT MOST ONCE per entire test)
// e.g. 12 + 5 - 4, 20 + 15 - 4, 8 × 5 + 3, 30 - 8 + 6, 15 + 7 - 3
function genChainedArithmetic(rng: SeededRNG, id: string): MathExpression {
  const pattern = rng.randomChoice(["add-sub", "sub-add", "mul-add", "mul-sub"]);
  if (pattern === "add-sub") {
    const a = rng.randomInt(8, 20);
    const b = rng.randomInt(4, 15);
    const c = rng.randomInt(2, Math.min(10, a + b - 2));
    const val = a + b - c;
    return { id, display: `${a} + ${b} - ${c}`, value: val };
  } else if (pattern === "sub-add") {
    const a = rng.randomInt(15, 30);
    const b = rng.randomInt(4, 12);
    const c = rng.randomInt(3, 10);
    const val = a - b + c;
    return { id, display: `${a} - ${b} + ${c}`, value: val };
  } else if (pattern === "mul-add") {
    const a = rng.randomInt(3, 7);
    const b = rng.randomInt(3, 6);
    const c = rng.randomInt(2, 8);
    const val = a * b + c;
    return { id, display: `${a} × ${b} + ${c}`, value: val };
  } else {
    const a = rng.randomInt(4, 8);
    const b = rng.randomInt(3, 6);
    const prod = a * b;
    const c = rng.randomInt(2, Math.min(10, prod - 2));
    const val = prod - c;
    return { id, display: `${a} × ${b} - ${c}`, value: val };
  }
}

// 8. Decimal addition (1 operator)
function genDecimalAddition(rng: SeededRNG, id: string): MathExpression {
  const mode = rng.randomChoice(["dec-int", "int-dec", "dec-dec"]);
  if (mode === "dec-int") {
    const aWhole = rng.randomInt(2, 8);
    const aFrac = rng.randomChoice([2, 5, 6, 8]);
    const a = cleanNumber(aWhole + aFrac / 10);
    const b = rng.randomInt(2, 8);
    const val = cleanNumber(a + b);
    return { id, display: `${a} + ${b}`, value: val };
  } else if (mode === "int-dec") {
    const a = rng.randomInt(2, 8);
    const bWhole = rng.randomInt(2, 8);
    const bFrac = rng.randomChoice([2, 5, 6, 8]);
    const b = cleanNumber(bWhole + bFrac / 10);
    const val = cleanNumber(a + b);
    return { id, display: `${a} + ${b}`, value: val };
  } else {
    const aWhole = rng.randomInt(2, 6);
    const aFrac = rng.randomChoice([5, 6]);
    const a = cleanNumber(aWhole + aFrac / 10);
    const bWhole = rng.randomInt(2, 6);
    const bFrac = rng.randomChoice([4, 5, 9]);
    const b = cleanNumber(bWhole + bFrac / 10);
    const val = cleanNumber(a + b);
    return { id, display: `${a} + ${b}`, value: val };
  }
}

// 9. Decimal subtraction (1 operator)
function genDecimalSubtraction(rng: SeededRNG, id: string): MathExpression {
  const aWhole = rng.randomInt(7, 15);
  const aFrac = rng.randomChoice([4, 5, 6, 8]);
  const a = cleanNumber(aWhole + aFrac / 10);

  const bWhole = rng.randomInt(2, aWhole - 2);
  const bFrac = rng.randomChoice([1, 2, 5]);
  const b = cleanNumber(bWhole + bFrac / 10);

  const val = cleanNumber(a - b);
  return { id, display: `${a} - ${b}`, value: val };
}

// 10. Decimal multiplication or division (1 operator)
function genDecimalMulDiv(rng: SeededRNG, id: string): MathExpression {
  const mode = rng.randomChoice(["mul", "div"]);
  if (mode === "mul") {
    const a = rng.randomChoice([1.5, 2.4, 2.5, 3.2, 3.5, 4.2]);
    const b = rng.randomChoice([2, 3, 4]);
    const val = cleanNumber(a * b);
    return { id, display: `${a} × ${b}`, value: val };
  } else {
    const quotient = rng.randomChoice([2.5, 3.2, 4.2, 2.4, 3.5]);
    const b = rng.randomChoice([2, 3]);
    const a = cleanNumber(quotient * b);
    const val = quotient;
    return { id, display: `${a} ÷ ${b}`, value: val };
  }
}

// 11. Square expression (e.g. 2², 3², 4², 5², 6², 7², 8², 9², 10²)
function genSquare(rng: SeededRNG, minBase: number, maxBase: number, id: string): MathExpression {
  const base = rng.randomInt(minBase, maxBase);
  const val = base * base;
  return { id, display: `${base}²`, value: val };
}

// 12. Cube expression (e.g. 2³, 3³, 4³, 5³)
function genCube(rng: SeededRNG, minBase: number, maxBase: number, id: string): MathExpression {
  const base = rng.randomInt(minBase, maxBase);
  const val = base * base * base;
  return { id, display: `${base}³`, value: val };
}

// 13. Nested expression using parentheses (RESERVED ONLY FOR FINAL 2–3 QUESTIONS)
// e.g. 12 + (8 × 4), 11 + (2 × 3), 15 + (6 × 4), 180 + (6 × 3), 20 + (18 ÷ 3), 8 × (6 - 2)
function genNestedExpression(rng: SeededRNG, id: string): MathExpression {
  const pattern = rng.randomChoice(["small-nested", "mid-nested", "large-nested"]);

  if (pattern === "small-nested") {
    // Small scale (value roughly 15 to 35)
    // e.g. 11 + (2 × 3) = 17, 8 × (6 - 2) = 32, 15 - (2 × 4) = 7, 12 + (3 × 4) = 24
    const subType = rng.randomChoice(["add-mul", "mul-sub", "sub-mul", "add-div"]);
    if (subType === "add-mul") {
      const a = rng.randomChoice([9, 11, 12, 14, 15]);
      const b = rng.randomInt(2, 4);
      const c = rng.randomInt(2, 4);
      const val = a + b * c;
      return { id, display: `${a} + (${b} × ${c})`, value: val };
    } else if (subType === "mul-sub") {
      const a = rng.randomInt(4, 8);
      const y = rng.randomInt(2, 4);
      const x = y + rng.randomInt(2, 5);
      const val = a * (x - y);
      return { id, display: `${a} × (${x} - ${y})`, value: val };
    } else if (subType === "sub-mul") {
      const b = rng.randomInt(2, 4);
      const c = rng.randomInt(2, 3);
      const prod = b * c;
      const a = prod + rng.randomChoice([8, 12, 15, 18]);
      const val = a - prod;
      return { id, display: `${a} - (${b} × ${c})`, value: val };
    } else {
      const a = rng.randomChoice([10, 12, 15, 20]);
      const c = rng.randomInt(2, 4);
      const q = rng.randomInt(2, 5);
      const b = c * q;
      const val = a + q;
      return { id, display: `${a} + (${b} ÷ ${c})`, value: val };
    }
  } else if (pattern === "mid-nested") {
    // Mid scale (value roughly 35 to 80)
    // e.g. 12 + (8 × 4) = 44, 15 + (6 × 4) = 39, 70 - (4 × 5) = 50, 11 + (8 × 7) = 67
    const subType = rng.randomChoice(["add-mul", "sub-mul", "add-add"]);
    if (subType === "add-mul") {
      const a = rng.randomChoice([11, 12, 15, 18, 20]);
      const b = rng.randomInt(4, 8);
      const c = rng.randomInt(3, 7);
      const val = a + b * c;
      return { id, display: `${a} + (${b} × ${c})`, value: val };
    } else if (subType === "sub-mul") {
      const b = rng.randomInt(3, 6);
      const c = rng.randomInt(3, 5);
      const prod = b * c;
      const a = prod + rng.randomChoice([20, 25, 30, 40]);
      const val = a - prod;
      return { id, display: `${a} - (${b} × ${c})`, value: val };
    } else {
      const a = rng.randomChoice([20, 30, 40]);
      const b = rng.randomInt(8, 18);
      const c = rng.randomInt(6, 15);
      const val = a + (b + c);
      return { id, display: `${a} + (${b} + ${c})`, value: val };
    }
  } else {
    // Large scale (value roughly 100 to 200)
    // e.g. 180 + (6 × 3) = 198, 150 + (30 ÷ 5) = 156, 120 - (15 + 5) = 100, 100 + (8 × 3) = 124
    const a = rng.randomChoice([100, 120, 140, 150, 180]);
    const op = rng.randomChoice(["+", "-"]);
    const innerType = rng.randomChoice(["mul", "div", "add"]);

    let innerDisplay = "";
    let innerVal = 0;

    if (innerType === "mul") {
      const b = rng.randomInt(3, 8);
      const c = rng.randomInt(2, 5);
      innerVal = b * c;
      innerDisplay = `${b} × ${c}`;
    } else if (innerType === "div") {
      const c = rng.randomInt(3, 6);
      const q = rng.randomInt(4, 9);
      const b = c * q;
      innerVal = q;
      innerDisplay = `${b} ÷ ${c}`;
    } else {
      const b = rng.randomInt(10, 20);
      const c = rng.randomInt(4, 12);
      innerVal = b + c;
      innerDisplay = `${b} + ${c}`;
    }

    const val = op === "+" ? a + innerVal : a - innerVal;
    return { id, display: `${a} ${op} (${innerDisplay})`, value: val };
  }
}

/**
 * Generates an expression with a target value within a specific scale band for consistent comparison
 */
function genScaledExpression(rng: SeededRNG, minVal: number, maxVal: number, id: string): MathExpression {
  const type = rng.randomChoice(["mul", "div", "add", "sub", "square", "cube"]);

  if (type === "mul") {
    // Find factors that multiply to something in [minVal, maxVal]
    for (let attempt = 0; attempt < 20; attempt++) {
      const a = rng.randomInt(2, 15);
      const minB = Math.max(2, Math.ceil(minVal / a));
      const maxB = Math.max(minB, Math.floor(maxVal / a));
      if (maxB >= minB) {
        const b = rng.randomInt(minB, maxB);
        const val = a * b;
        if (val >= minVal && val <= maxVal) {
          return { id, display: `${a} × ${b}`, value: val };
        }
      }
    }
  }

  if (type === "div") {
    const q = rng.randomInt(Math.max(2, Math.floor(minVal)), Math.max(3, Math.ceil(maxVal)));
    const b = rng.randomInt(2, 10);
    const a = b * q;
    return { id, display: `${a} ÷ ${b}`, value: q };
  }

  if (type === "square") {
    const minBase = Math.max(2, Math.ceil(Math.sqrt(minVal)));
    const maxBase = Math.max(minBase, Math.floor(Math.sqrt(maxVal)));
    if (maxBase >= minBase && minBase <= 14) {
      const base = rng.randomInt(minBase, maxBase);
      const val = base * base;
      return { id, display: `${base}²`, value: val };
    }
  }

  if (type === "cube") {
    const minBase = Math.max(2, Math.ceil(Math.cbrt(minVal)));
    const maxBase = Math.max(minBase, Math.floor(Math.cbrt(maxVal)));
    if (maxBase >= minBase && minBase <= 6) {
      const base = rng.randomInt(minBase, maxBase);
      const val = base * base * base;
      return { id, display: `${base}³`, value: val };
    }
  }

  if (type === "sub") {
    const target = rng.randomInt(Math.floor(minVal), Math.ceil(maxVal));
    const b = rng.randomInt(5, Math.max(6, Math.floor(target * 0.6)));
    const a = target + b;
    return { id, display: `${a} - ${b}`, value: target };
  }

  // Fallback to addition
  const target = rng.randomInt(Math.max(3, Math.floor(minVal)), Math.max(4, Math.ceil(maxVal)));
  const a = rng.randomInt(1, Math.max(2, target - 1));
  const b = target - a;
  return { id, display: `${a} + ${b}`, value: target };
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Progression Generation Controller
 * ─────────────────────────────────────────────────────────────────────────────
 */

type GeneratorFunc = (rng: SeededRNG, id: string) => MathExpression;

interface TestGenerationContext {
  hasChainedInTest: boolean; // Enforces Rule 8: Max 1 chained question across entire test
}

/**
 * Returns candidate generators for questions 1 through count - 4 (indices 0 to 24)
 */
function getStandardGeneratorsForIndex(
  index: number,
  ctx: TestGenerationContext
): GeneratorFunc[] {
  // Band 1: Questions 1–5 (Indices 0–4)
  // ONE single value + TWO simple arithmetic bubbles
  if (index < 5) {
    return [
      (r, id) => genAddition(r, 2, 7, 2, 7, id),
      (r, id) => genSubtraction(r, 8, 15, id),
      (r, id) => genMultiplication(r, 2, 5, 2, 4, id),
      (r, id) => genDivision(r, 2, 4, 2, 6, id),
    ];
  }

  // Band 2: Questions 6–10 (Indices 5–9)
  // All three arithmetic expressions (1 operator per bubble)
  if (index < 10) {
    const pool: GeneratorFunc[] = [
      (r, id) => genAddition(r, 4, 15, 3, 12, id),
      (r, id) => genSubtraction(r, 12, 25, id),
      (r, id) => genMultiplication(r, 3, 7, 3, 6, id),
      (r, id) => genDivision(r, 3, 6, 3, 8, id),
    ];
    // Allow at most one chained expression question across the whole test (Rule 8)
    if (!ctx.hasChainedInTest) {
      pool.push((r, id) => genChainedArithmetic(r, id));
    }
    return pool;
  }

  // Band 3: Questions 11–15 (Indices 10–14)
  // Decimals introduced (single decimal, 2 decimals + 1 arithmetic, decimal arithmetic)
  if (index < 15) {
    const pool: GeneratorFunc[] = [
      (r, id) => genSingleDecimal(r, id),
      (r, id) => genDecimalAddition(r, id),
      (r, id) => genDecimalSubtraction(r, id),
      (r, id) => genDecimalMulDiv(r, id),
      (r, id) => genAddition(r, 6, 18, 5, 15, id),
      (r, id) => genSubtraction(r, 15, 30, id),
      (r, id) => genMultiplication(r, 4, 8, 3, 7, id),
      (r, id) => genDivision(r, 3, 7, 3, 9, id),
    ];
    if (!ctx.hasChainedInTest) {
      pool.push((r, id) => genChainedArithmetic(r, id));
    }
    return pool;
  }

  // Band 4: Questions 16–21 (Indices 15–20)
  // Squares & Cubes introduced: simple squares (2²..9²), cubes (2³..5³), decimals, arithmetic
  if (index < 21) {
    const pool: GeneratorFunc[] = [
      (r, id) => genSquare(r, 3, 8, id),
      (r, id) => genCube(r, 2, 4, id),
      (r, id) => genSingleDecimal(r, id),
      (r, id) => genDecimalAddition(r, id),
      (r, id) => genDecimalSubtraction(r, id),
      (r, id) => genAddition(r, 10, 25, 8, 20, id),
      (r, id) => genSubtraction(r, 20, 45, id),
      (r, id) => genMultiplication(r, 4, 9, 4, 8, id),
      (r, id) => genDivision(r, 4, 9, 4, 10, id),
    ];
    if (!ctx.hasChainedInTest) {
      pool.push((r, id) => genChainedArithmetic(r, id));
    }
    return pool;
  }

  // Band 5: Questions 22 to count - 4 (Indices 21 to 24 for 28 items)
  // Advanced mix WITHOUT parentheses: larger squares, cubes, decimal arithmetic, clean divisions
  const pool: GeneratorFunc[] = [
    (r, id) => genSquare(r, 6, 12, id),
    (r, id) => genCube(r, 3, 5, id),
    (r, id) => genDecimalAddition(r, id),
    (r, id) => genDecimalSubtraction(r, id),
    (r, id) => genMultiplication(r, 6, 15, 4, 10, id),
    (r, id) => genDivision(r, 4, 12, 5, 15, id),
    (r, id) => genSubtraction(r, 30, 80, id),
    (r, id) => genAddition(r, 20, 50, 15, 45, id),
  ];
  if (!ctx.hasChainedInTest) {
    pool.push((r, id) => genChainedArithmetic(r, id));
  }
  return pool;
}

/**
 * Generates one of the final 2–3 questions with controlled nested expression ranking (Rule 10 & 11 & 12 & 13)
 * Target rank is randomly chosen: LOWEST, MIDDLE, or HIGHEST.
 */
function generateFinalNestedQuestion(rng: SeededRNG, index: number): BubbleMathQuestion {
  const MAX_RETRIES = 100;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // 1. Generate nested expression
    const nestedExpr = genNestedExpression(rng, "expr-nested");
    const vNested = nestedExpr.value;

    // 2. Choose target ranking randomly (roughly 1/3 LOWEST, 1/3 MIDDLE, 1/3 HIGHEST)
    const targetRank = rng.randomChoice(["LOWEST", "MIDDLE", "HIGHEST"] as const);

    // 3. Determine consistent value scale for the other 2 bubbles based on vNested
    let minA: number, maxA: number, minB: number, maxB: number;

    if (targetRank === "LOWEST") {
      // Both other values must be greater than vNested
      minA = vNested + 3;
      maxA = vNested + Math.max(8, Math.round(vNested * 0.4));
      minB = maxA + 3;
      maxB = maxA + Math.max(10, Math.round(vNested * 0.5));
    } else if (targetRank === "HIGHEST") {
      // Both other values must be less than vNested
      maxB = Math.max(2, vNested - 3);
      minB = Math.max(2, vNested - Math.max(8, Math.round(vNested * 0.4)));
      maxA = Math.max(2, minB - 3);
      minA = Math.max(2, minB - Math.max(8, Math.round(vNested * 0.4)));
    } else {
      // MIDDLE: One value below vNested, one value above vNested
      maxA = Math.max(2, vNested - 3);
      minA = Math.max(2, vNested - Math.max(8, Math.round(vNested * 0.4)));
      minB = vNested + 3;
      maxB = vNested + Math.max(8, Math.round(vNested * 0.4));
    }

    const expr1 = genScaledExpression(rng, minA, maxA, "expr-1");
    const expr2 = genScaledExpression(rng, minB, maxB, "expr-2");

    const expressions = [nestedExpr, expr1, expr2];
    const values = expressions.map((e) => e.value);
    const uniqueValues = new Set(values);

    // Ensure 3 unique values and no undefined/NaN
    if (
      uniqueValues.size !== 3 ||
      values.some((v) => !Number.isFinite(v) || isNaN(v))
    ) {
      continue;
    }

    // Verify the nested expression achieves the target rank
    const sortedVals = [...values].sort((a, b) => a - b);
    let actualRank: "LOWEST" | "MIDDLE" | "HIGHEST";
    if (vNested === sortedVals[0]) {
      actualRank = "LOWEST";
    } else if (vNested === sortedVals[1]) {
      actualRank = "MIDDLE";
    } else {
      actualRank = "HIGHEST";
    }

    if (actualRank !== targetRank) {
      continue;
    }

    // Assign stable IDs
    expressions.forEach((e, idx) => {
      e.id = `expr-${idx}`;
    });

    // Create correct ascending order IDs
    const sorted = [...expressions].sort((a, b) => a.value - b.value);
    const correctOrderIds = sorted.map((e) => e.id);

    // Shuffle visual display order
    const displayOrderIds = rng.shuffle(expressions.map((e) => e.id));

    // Assign randomized layout pattern
    const layoutPattern = rng.randomChoice(["A", "B", "C", "D"] as const);

    return {
      expressions,
      correctOrderIds,
      displayOrderIds,
      layoutPattern,
    };
  }

  throw new Error(`Failed to generate valid nested question for index ${index}`);
}

/**
 * Generate a single question for Full Mock Test with strict validation
 */
function generateMockQuestionAtIndex(
  rng: SeededRNG,
  index: number,
  totalCount: number,
  ctx: TestGenerationContext
): BubbleMathQuestion {
  // In final 2-3 questions: use controlled nested ranking algorithm
  if (index >= totalCount - 3) {
    return generateFinalNestedQuestion(rng, index);
  }

  const MAX_RETRIES = 100;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const expressions: MathExpression[] = [];
    const values = new Set<number>();
    const displays = new Set<string>();

    if (index < 5) {
      // Stage 1: Questions 1–5 (Indices 0–4)
      // Exactly ONE single integer + TWO arithmetic expressions
      const singleExpr = genSingleInteger(rng, 4, 12, "expr-single");
      values.add(singleExpr.value);
      displays.add(singleExpr.display);
      expressions.push(singleExpr);

      const pool = getStandardGeneratorsForIndex(index, ctx);
      const chosenGen1 = rng.randomChoice(pool);
      let chosenGen2 = rng.randomChoice(pool);
      let subAttempt = 0;
      while (chosenGen2 === chosenGen1 && subAttempt < 10) {
        chosenGen2 = rng.randomChoice(pool);
        subAttempt++;
      }

      const expr1 = chosenGen1(rng, "expr-1");
      const expr2 = chosenGen2(rng, "expr-2");

      if (
        !Number.isFinite(expr1.value) ||
        isNaN(expr1.value) ||
        values.has(expr1.value) ||
        displays.has(expr1.display)
      ) {
        continue;
      }
      values.add(expr1.value);
      displays.add(expr1.display);
      expressions.push(expr1);

      if (
        !Number.isFinite(expr2.value) ||
        isNaN(expr2.value) ||
        values.has(expr2.value) ||
        displays.has(expr2.display)
      ) {
        continue;
      }
      values.add(expr2.value);
      displays.add(expr2.display);
      expressions.push(expr2);
    } else {
      // Stages 2–5: Questions 6 to totalCount - 4
      const pool = getStandardGeneratorsForIndex(index, ctx);
      const chosenGens: GeneratorFunc[] = [];

      while (chosenGens.length < 3) {
        const cand = rng.randomChoice(pool);
        if (!chosenGens.includes(cand) || chosenGens.length === 2) {
          chosenGens.push(cand);
        }
      }

      for (let i = 0; i < 3; i++) {
        const exprId = `expr-${i}`;
        const expr = chosenGens[i](rng, exprId);

        if (
          !Number.isFinite(expr.value) ||
          isNaN(expr.value) ||
          values.has(expr.value) ||
          displays.has(expr.display)
        ) {
          break;
        }

        values.add(expr.value);
        displays.add(expr.display);
        expressions.push(expr);
      }
    }

    if (expressions.length === 3) {
      // Check if any expression in this question is chained arithmetic
      const isChainedQuestion = expressions.some((e) => {
        const parts = e.display.split(/[\+\-\×\÷]/);
        return parts.length >= 3 && !e.display.includes("(");
      });

      if (isChainedQuestion) {
        ctx.hasChainedInTest = true;
      }

      // Re-assign distinct stable IDs
      expressions.forEach((e, idx) => {
        e.id = `expr-${idx}`;
      });

      // Sort in ascending numerical order for correctOrderIds
      const sorted = [...expressions].sort((a, b) => a.value - b.value);
      const correctOrderIds = sorted.map((e) => e.id);

      // Shuffle displayOrderIds so visual positions are randomized
      const displayOrderIds = rng.shuffle(expressions.map((e) => e.id));

      // Randomly assign one of 4 predefined layout patterns
      const layoutPattern = rng.randomChoice(["A", "B", "C", "D"] as const);

      return {
        expressions,
        correctOrderIds,
        displayOrderIds,
        layoutPattern,
      };
    }
  }

  throw new Error(`Failed to generate valid Mock Test question at index ${index}`);
}

/**
 * Generate complete progressive question set for Full Mock Test (default 28 questions)
 */
export function generateMockQuestions(rng: SeededRNG, count: number = 28): BubbleMathQuestion[] {
  const questions: BubbleMathQuestion[] = [];
  const ctx: TestGenerationContext = {
    hasChainedInTest: false,
  };

  for (let i = 0; i < count; i++) {
    questions.push(generateMockQuestionAtIndex(rng, i, count, ctx));
  }
  return questions;
}

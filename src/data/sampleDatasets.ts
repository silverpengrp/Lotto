import { Pick3Draw } from '../types/lottery';

// Helper to construct a Pick3Draw object
export function createDraw(
  id: string,
  date: string,
  drawType: Pick3Draw['drawType'],
  numberStr: string,
  drawNumber?: number,
  customDigits?: [number, number, number]
): Pick3Draw {
  let rawD1: number;
  let rawD2: number;
  let rawD3: number;
  let formattedStr: string;

  if (customDigits && customDigits.length === 3) {
    rawD1 = customDigits[0];
    rawD2 = customDigits[1];
    rawD3 = customDigits[2];
    formattedStr = `${rawD1}-${rawD2}-${rawD3}`;
  } else {
    // Check if numberStr has separators like 12-45-13, 12, 45, 13 or spaces
    const parts = numberStr.trim().split(/[\s,\-_;|]+/).filter(Boolean);
    if (parts.length >= 3 && parts.every(p => !isNaN(parseInt(p, 10)))) {
      rawD1 = parseInt(parts[0], 10);
      rawD2 = parseInt(parts[1], 10);
      rawD3 = parseInt(parts[2], 10);
      formattedStr = `${rawD1}-${rawD2}-${rawD3}`;
    } else {
      const cleanStr = numberStr.replace(/[^0-9]/g, '');
      if (cleanStr.length === 6) {
        // e.g. "124513" -> 12, 45, 13
        rawD1 = parseInt(cleanStr.slice(0, 2), 10);
        rawD2 = parseInt(cleanStr.slice(2, 4), 10);
        rawD3 = parseInt(cleanStr.slice(4, 6), 10);
        formattedStr = `${rawD1}-${rawD2}-${rawD3}`;
      } else {
        const padded = cleanStr.padStart(3, '0').slice(-3);
        rawD1 = parseInt(padded[0], 10);
        rawD2 = parseInt(padded[1], 10);
        rawD3 = parseInt(padded[2], 10);
        formattedStr = padded;
      }
    }
  }

  const isTwoDigit = rawD1 >= 10 || rawD2 >= 10 || rawD3 >= 10;
  // d1, d2, d3 are normalized to 0-9 for 10x10 Markov transitions & single-digit analytics
  const d1 = rawD1 % 10;
  const d2 = rawD2 % 10;
  const d3 = rawD3 % 10;
  const sum = isTwoDigit ? rawD1 + rawD2 + rawD3 : d1 + d2 + d3;

  let type: Pick3Draw['type'] = 'single';
  if (rawD1 === rawD2 && rawD2 === rawD3) {
    type = 'triple';
  } else if (rawD1 === rawD2 || rawD2 === rawD3 || rawD1 === rawD3) {
    type = 'double';
  }

  const odds = [rawD1, rawD2, rawD3].filter(n => n % 2 !== 0).length;
  const evens = 3 - odds;
  const oddEven = `${odds}O${evens}E`;

  const highs = [rawD1, rawD2, rawD3].filter(n => (isTwoDigit ? n >= 50 : n >= 5)).length;
  const lows = 3 - highs;
  const highLow = `${highs}H${lows}L`;

  return {
    id,
    date,
    drawType,
    d1,
    d2,
    d3,
    rawD1,
    rawD2,
    rawD3,
    isTwoDigit,
    numberStr: formattedStr,
    sum,
    type,
    oddEven,
    highLow,
    drawNumber,
  };
}

// Generate realistic pseudo-historical series with realistic mechanical lottery dispersion
function generateHistoricalBatch(
  statePrefix: string,
  startDateStr: string,
  count: number,
  seed: number
): Pick3Draw[] {
  const draws: Pick3Draw[] = [];
  let currentSeed = seed;

  // Linear congruential generator with slight state machine transition
  const nextRng = () => {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    return currentSeed / 4294967296;
  };

  const startDate = new Date(startDateStr);

  for (let i = 0; i < count; i++) {
    const drawDate = new Date(startDate);
    drawDate.setDate(startDate.getDate() - (count - 1 - i));
    const dateFormatted = drawDate.toISOString().split('T')[0];
    const drawType = i % 2 === 0 ? 'Evening' : 'Midday';

    // Pick 3 digits (0-9)
    const d1 = Math.floor(nextRng() * 10);
    const d2 = Math.floor(nextRng() * 10);
    const d3 = Math.floor(nextRng() * 10);
    const numStr = `${d1}${d2}${d3}`;

    draws.push(
      createDraw(
        `${statePrefix}-${i + 1}`,
        dateFormatted,
        drawType,
        numStr,
        1000 + i
      )
    );
  }

  return draws;
}

// Preloaded realistic datasets
export const PRELOADED_DATASETS: Record<string, { name: string; state: string; draws: Pick3Draw[] }> = {
  texas: {
    name: 'Texas Pick 3 (Daily 4x / 2x History)',
    state: 'Texas',
    draws: generateHistoricalBatch('TX', '2026-10-05', 180, 8492019),
  },
  florida: {
    name: 'Florida Cash 3 (Midday & Evening)',
    state: 'Florida',
    draws: generateHistoricalBatch('FL', '2026-10-05', 160, 4820194),
  },
  california: {
    name: 'California Daily 3',
    state: 'California',
    draws: generateHistoricalBatch('CA', '2026-10-05', 150, 9283741),
  },
  newyork: {
    name: 'New York Numbers',
    state: 'New York',
    draws: generateHistoricalBatch('NY', '2026-10-05', 170, 3174920),
  },
  ohio: {
    name: 'Ohio Pick 3',
    state: 'Ohio',
    draws: generateHistoricalBatch('OH', '2026-10-05', 140, 6729104),
  },
};

/**
 * Universal Parser for user pasted text or CSV files
 * Supports:
 * - Simple 3-digit per line: "123\n456\n789"
 * - Comma or space separated: "123, 456, 789" or "1 2 3, 4 5 6"
 * - CSV with headers: "Date,Draw,Result" or "Date,Result"
 * - Tabular formats with dates
 */
export function parseUserDraws(rawInput: string): Pick3Draw[] {
  const lines = rawInput.trim().split(/\r?\n/);
  const parsed: Pick3Draw[] = [];
  const baseDate = new Date();

  let lineCounter = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.toLowerCase().startsWith('date') || trimmed.toLowerCase().startsWith('draw') || trimmed.toLowerCase().startsWith('#')) {
      continue;
    }

    // Check if line contains CSV/tab delimiters
    const parts = trimmed.split(/[,\t;|]/).map(p => p.trim());

    let foundNum: string | null = null;
    let foundDate: string | null = null;
    let foundType: Pick3Draw['drawType'] = 'Evening';

    if (parts.length >= 2) {
      // Check if parts has 3 numeric tokens (1 or 2 digits each, e.g. 12, 45, 13)
      const numericTokens = parts.filter(p => /^\d{1,2}$/.test(p));
      if (numericTokens.length >= 3 && !foundNum) {
        foundNum = `${numericTokens[0]}-${numericTokens[1]}-${numericTokens[2]}`;
      }

      // Look for a 3-digit number part or date
      for (const part of parts) {
        const clean = part.replace(/[^0-9]/g, '');
        if (clean.length === 3 && !foundNum) {
          foundNum = clean;
        } else if (part.match(/\d{4}-\d{2}-\d{2}/) || part.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) {
          foundDate = part;
        } else if (part.toLowerCase().includes('mid')) {
          foundType = 'Midday';
        } else if (part.toLowerCase().includes('eve')) {
          foundType = 'Evening';
        } else if (part.toLowerCase().includes('morn')) {
          foundType = 'Morning';
        } else if (part.toLowerCase().includes('night')) {
          foundType = 'Night';
        }
      }
    }

    if (!foundNum) {
      // Check for space/comma separated numbers e.g. "12, 45, 13" or "12 45 13"
      const tokens = trimmed.split(/[\s,\-_;|]+/).filter(t => /^\d{1,2}$/.test(t));
      if (tokens.length >= 3) {
        foundNum = `${tokens[0]}-${tokens[1]}-${tokens[2]}`;
      } else {
        // Try regex search for 3 consecutive digits
        const match = trimmed.match(/\b\d{3}\b/);
        if (match) {
          foundNum = match[0];
        } else {
          const singleDigits = trimmed.match(/\b\d\b/g);
          if (singleDigits && singleDigits.length >= 3) {
            foundNum = singleDigits.slice(0, 3).join('');
          }
        }
      }
    }

    if (foundNum) {
      const calcDate = foundDate || new Date(baseDate.getTime() - (lines.length - lineCounter) * 86400000).toISOString().split('T')[0];
      parsed.push(
        createDraw(
          `custom-${lineCounter}`,
          calcDate,
          foundType,
          foundNum,
          lineCounter
        )
      );
      lineCounter++;
    }
  }

  return parsed;
}

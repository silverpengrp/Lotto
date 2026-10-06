export interface Pick3Draw {
  id: string;
  drawNumber?: number;
  date: string;
  drawType: 'Midday' | 'Evening' | 'Morning' | 'Night' | 'Standard';
  d1: number; // Hundreds digit (0-9)
  d2: number; // Tens digit (0-9)
  d3: number; // Ones digit (0-9)
  rawD1?: number; // Raw entered number (e.g. 12)
  rawD2?: number; // Raw entered number (e.g. 45)
  rawD3?: number; // Raw entered number (e.g. 13)
  isTwoDigit?: boolean; // true if any space has number >= 10
  numberStr: string; // "000" - "999" or "12-45-13"
  sum: number; // sum of digits or sum of numbers
  type: 'single' | 'double' | 'triple';
  oddEven: string; // e.g. "2O1E"
  highLow: string; // e.g. "1H2L" (0-4 Low, 5-9 High)
}

export interface DigitPositionStats {
  digit: number;
  count: number;
  frequency: number; // percentage (0 - 100)
  currentSkip: number; // draws since last seen in this position
  avgSkip: number;
  maxSkip: number;
  recentCount10: number; // in last 10 draws
  recentCount25: number; // in last 25 draws
  recentCount50: number; // in last 50 draws
  ewma: number; // Exponential Weighted Moving Average
  momentum: number; // recent rate vs expected rate
  status: 'hot' | 'cold' | 'due' | 'neutral';
}

export interface OverallDigitStats {
  digit: number;
  totalCount: number;
  frequency: number; // out of total digits (3 * N draws)
  currentSkip: number;
  avgSkip: number;
  maxSkip: number;
  status: 'hot' | 'cold' | 'due' | 'neutral';
  positions: {
    hundreds: number;
    tens: number;
    ones: number;
  };
}

export interface PairStats {
  pair: string; // "00" to "99"
  type: 'front' | 'back' | 'split';
  count: number;
  frequency: number;
  currentSkip: number;
}

export interface MarkovTransitionStats {
  // 10x10 matrix: matrix[fromDigit][toDigit] = probability
  hundredsMatrix: number[][];
  tensMatrix: number[][];
  onesMatrix: number[][];
  overallMatrix: number[][];
}

export interface PatternDistributionStats {
  sumDistribution: { sum: number; count: number; empiricalPct: number; theoreticalPct: number }[];
  oddEvenDistribution: { pattern: string; count: number; empiricalPct: number; theoreticalPct: number }[];
  highLowDistribution: { pattern: string; count: number; empiricalPct: number; theoreticalPct: number }[];
  typeDistribution: { type: 'single' | 'double' | 'triple'; count: number; empiricalPct: number; theoreticalPct: number }[];
  meanSum: number;
  theoreticalMeanSum: number; // 13.5
  stdDevSum: number;
  chiSquareDigit: {
    statistic: number;
    degreesOfFreedom: number;
    pValue: number;
    isUniform: boolean;
  };
}

export interface ModelScoreBreakdown {
  frequency: number; // 0-100
  recency: number; // 0-100
  bayesian: number; // 0-100
  markov: number; // 0-100
  pattern: number; // 0-100
  monteCarlo: number; // 0-100
  ml: number; // 0-100
  quantum: number; // 0-100 (Quantum probability & interference)
  overdue: number; // 0-100
  transition: number; // 0-100
  position: number; // 0-100
  penalty: number; // 0-100 (penalty deduction)
}

export interface ModelRanks {
  frequency: number; // 1-1000
  recency: number; // 1-1000
  bayesian: number; // 1-1000
  markov: number; // 1-1000
  pattern: number; // 1-1000
  monteCarlo: number; // 1-1000
  ml: number; // 1-1000
}

export interface CombinationScore {
  numberStr: string;
  d1: number;
  d2: number;
  d3: number;
  rawD1?: number; // Raw 2-digit number for space 1 (e.g. 12)
  rawD2?: number; // Raw 2-digit number for space 2 (e.g. 45)
  rawD3?: number; // Raw 2-digit number for space 3 (e.g. 13)
  isTwoDigit?: boolean; // true if in 2-digit ball mode
  sum: number;
  rootSum: number;
  type: 'single' | 'double' | 'triple';
  oddEven: string;
  highLow: string;
  mirrors: string; // mirror counterpart e.g. 123 -> 678
  boxForms: string[]; // unique permutations
  straightScore: number; // composite 0-100
  estimatedProb: number; // model probability estimate (sums to 1 across 1000)
  ensembleRank: number; // 1 to 1000
  modelRanks: ModelRanks;
  componentScores: ModelScoreBreakdown;
  quantumCoherence?: number; // 0-100% coherence
  quantumPhase?: number; // Phase angle in radians
  quantumConstructive?: boolean; // Constructive vs Destructive interference
  explanation: string;
}

export interface ModelWeights {
  frequency: number;
  recency: number;
  bayesian: number;
  markov: number;
  pattern: number;
  monteCarlo: number;
  ml: number;
  quantum?: number;
  overfittingPenalty: number;
}

export interface BacktestDrawLog {
  drawIndex: number;
  drawDate: string;
  drawNumberStr: string;
  predictedTop1: string;
  actualRank: number;
  straightHitTop1: boolean;
  straightHitTop5: boolean;
  straightHitTop10: boolean;
  straightHitTop25: boolean;
  boxHitTop10: boolean;
  digitsMatchedWithTop1: number;
}

export interface BacktestResults {
  drawsTested: number;
  straightHitsTop1: number;
  straightHitsTop5: number;
  straightHitsTop10: number;
  straightHitsTop25: number;
  boxHitsTop1: number;
  boxHitsTop5: number;
  boxHitsTop10: number;
  boxHitsTop25: number;
  averageRank: number; // expected 500.5
  medianRank: number;
  randomExpectedTop10Hits: number;
  pValueVersusRandom: number;
  zScore: number;
  hasPredictivePower: boolean;
  outOfSampleLogLoss: number;
  inSampleLogLoss: number;
  overfitRatio: number; // outOfSample / inSample
  logs: BacktestDrawLog[];
}

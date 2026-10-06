import React, { useState } from 'react';
import { PatternDistributionStats, PairStats } from '../types/lottery';
import { BarChart3, HelpCircle, CheckCircle2, AlertTriangle, PieChart, ShieldAlert } from 'lucide-react';

interface PatternAnalyticsViewProps {
  patterns: PatternDistributionStats;
  frontPairs: PairStats[];
  backPairs: PairStats[];
  splitPairs: PairStats[];
}

export const PatternAnalyticsView: React.FC<PatternAnalyticsViewProps> = ({
  patterns,
  frontPairs,
  backPairs,
  splitPairs,
}) => {
  const [activePairType, setActivePairType] = useState<'front' | 'back' | 'split'>('front');

  const activePairs =
    activePairType === 'front' ? frontPairs : activePairType === 'back' ? backPairs : splitPairs;

  // Max percentage in sum distribution for height scaling
  const maxSumPct = Math.max(
    ...patterns.sumDistribution.map(s => Math.max(s.empiricalPct, s.theoreticalPct)),
    8
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 backdrop-blur">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              PATTERN & MACRO DISTRIBUTIONS
            </span>
            <span className="text-xs text-slate-400">
              Sums (0–27), Parity, High/Low & Combinatorial Structure
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Empirical vs. Theoretical Probability Benchmarks
          </h3>
        </div>

        {/* Chi-Square Hypothesis Test Badge */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex flex-col text-right">
            <span className="text-slate-400 text-[10px] uppercase">Chi-Square Uniformity Test:</span>
            <span className="text-white font-bold">
              χ² = {patterns.chiSquareDigit.statistic} (df = 9, p = {patterns.chiSquareDigit.pValue})
            </span>
          </div>
          {patterns.chiSquareDigit.isUniform ? (
            <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              UNIFORM (RANDOM)
            </span>
          ) : (
            <span className="px-2 py-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
              ANOMALOUS (NON-UNIFORM)
            </span>
          )}
        </div>
      </div>

      {/* Sum Distribution Chart (0 to 27) */}
      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Sum of Digits Distribution (0 through 27)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Historical Observed Frequencies (Solid Amber) vs. Combinatorial Normal Bell Curve (Dashed Sky Blue)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-300">
              Observed Mean: <strong className="text-amber-400">{patterns.meanSum}</strong>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              Theoretical Mean: <strong className="text-sky-400">{patterns.theoreticalMeanSum}</strong>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              Std Dev: <strong className="text-purple-400">{patterns.stdDevSum}</strong>
            </span>
          </div>
        </div>

        {/* 28 Sum Bars */}
        <div className="grid grid-cols-28 gap-0.5 sm:gap-1 items-end h-48 pt-4 px-1 border-b border-slate-800">
          {patterns.sumDistribution.map(sumItem => {
            const empHeight = (sumItem.empiricalPct / maxSumPct) * 100;
            const theoHeight = (sumItem.theoreticalPct / maxSumPct) * 100;

            return (
              <div
                key={sumItem.sum}
                className="flex flex-col items-center h-full justify-end group relative"
                title={`Sum ${sumItem.sum}: Actual ${sumItem.empiricalPct.toFixed(1)}% (${sumItem.count} hits), Expected ${sumItem.theoreticalPct.toFixed(1)}%`}
              >
                {/* Theoretical marker tick */}
                <div
                  className="absolute w-full border-t-2 border-sky-400/70 z-10 pointer-events-none"
                  style={{ bottom: `${theoHeight}%` }}
                />

                {/* Empirical Bar */}
                <div
                  className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm group-hover:from-amber-400 group-hover:to-amber-200 transition-all duration-200"
                  style={{ height: `${Math.max(4, empHeight)}%` }}
                />
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  {sumItem.sum % 3 === 0 ? sumItem.sum : ''}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Sum 0 (Min: 000)</span>
          <span className="text-amber-400 font-bold">Sum 13-14 (Peak Theoretical Density = 7.5% each)</span>
          <span>Sum 27 (Max: 999)</span>
        </div>
      </div>

      {/* Grid: Odd/Even, High/Low, Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Odd/Even Parity */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
            Parity Distribution (Odd / Even)
          </h4>
          <div className="space-y-2.5">
            {patterns.oddEvenDistribution.map(item => (
              <div key={item.pattern} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">{item.pattern}</span>
                  <span className="text-slate-400">
                    <strong className="text-amber-400">{item.empiricalPct.toFixed(1)}%</strong> ({item.count}) / exp {item.theoreticalPct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${item.empiricalPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High/Low Distribution */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
            High / Low Distribution (0-4 L, 5-9 H)
          </h4>
          <div className="space-y-2.5">
            {patterns.highLowDistribution.map(item => (
              <div key={item.pattern} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">{item.pattern}</span>
                  <span className="text-slate-400">
                    <strong className="text-emerald-400">{item.empiricalPct.toFixed(1)}%</strong> ({item.count}) / exp {item.theoreticalPct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${item.empiricalPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combination Type (Single / Double / Triple) */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
            Structure (Singles / Doubles / Triples)
          </h4>
          <div className="space-y-2.5">
            {patterns.typeDistribution.map(item => (
              <div key={item.type} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white capitalize font-bold">{item.type}s</span>
                  <span className="text-slate-400">
                    <strong className="text-sky-400">{item.empiricalPct.toFixed(1)}%</strong> ({item.count}) / exp {item.theoreticalPct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{ width: `${item.empiricalPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Digit Pairs Section */}
      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white">
              Digit-Pair Frequency Rankings
            </h4>
            <p className="text-xs text-slate-400">
              Front Pair (D1-D2), Back Pair (D2-D3), Split Pair (D1-D3)
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(['front', 'back', 'split'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActivePairType(t)}
                className={`px-3 py-1 rounded capitalize font-bold transition ${
                  activePairType === t
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t} Pairs
              </button>
            ))}
          </div>
        </div>

        {/* Top 12 Pairs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {activePairs.slice(0, 12).map((pairItem, idx) => (
            <div
              key={pairItem.pair}
              className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                <span className="text-xs font-mono text-slate-400">{pairItem.currentSkip} skip</span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-300 my-1">
                {pairItem.pair}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{pairItem.count} hits</span>
                <span className="text-emerald-400">{pairItem.frequency}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

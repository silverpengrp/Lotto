import React from 'react';
import { CombinationScore, Pick3Draw } from '../types/lottery';
import {
  ShieldAlert,
  Award,
  Layers,
  Activity,
  GitBranch,
  Compass,
  Cpu,
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface PrimaryPickCardProps {
  bestCombo: CombinationScore | null;
  lastDraw?: Pick3Draw;
  drawsCount: number;
  onInspectDetails?: (combo: CombinationScore) => void;
}

export const PrimaryPickCard: React.FC<PrimaryPickCardProps> = ({
  bestCombo,
  lastDraw,
  drawsCount,
  onInspectDetails,
}) => {
  if (!bestCombo) return null;

  const modelRankingBadges = [
    { label: 'Frequency', rank: bestCombo.modelRanks.frequency, icon: Activity, color: 'text-sky-400 bg-sky-950/40 border-sky-800' },
    { label: 'Recency', rank: bestCombo.modelRanks.recency, icon: TrendingUp, color: 'text-amber-400 bg-amber-950/40 border-amber-800' },
    { label: 'Bayesian', rank: bestCombo.modelRanks.bayesian, icon: Compass, color: 'text-purple-400 bg-purple-950/40 border-purple-800' },
    { label: 'Markov', rank: bestCombo.modelRanks.markov, icon: GitBranch, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
    { label: 'Pattern', rank: bestCombo.modelRanks.pattern, icon: Layers, color: 'text-pink-400 bg-pink-950/40 border-pink-800' },
    { label: 'Monte Carlo', rank: bestCombo.modelRanks.monteCarlo, icon: Cpu, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800' },
    { label: 'ML Ridge', rank: bestCombo.modelRanks.ml, icon: Award, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800' },
  ];

  const theoreticalProb = 0.001; // 1 in 1000 = 0.1%

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 relative overflow-hidden backdrop-blur">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner / Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400">
              Optimal Analytical Candidate
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            MODEL&apos;S HIGHEST-RANKED COMBINATION
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Dataset Baseline:</span>
          <span className="text-amber-300 font-semibold">{drawsCount} Historical Draws</span>
          {lastDraw && (
            <span className="text-slate-500 border-l border-slate-800 pl-2">
              Last Draw: <strong className="text-slate-300">{lastDraw.numberStr}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Display: Lottery Balls & Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        {/* The 3-Digit Number Balls */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start justify-center">
          <div className="flex items-center gap-3 sm:gap-4 my-2">
            {[
              bestCombo.rawD1 ?? bestCombo.d1,
              bestCombo.rawD2 ?? bestCombo.d2,
              bestCombo.rawD3 ?? bestCombo.d3,
            ].map((digit, i) => (
              <div
                key={i}
                className="relative group flex flex-col items-center"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 p-1 shadow-lg shadow-amber-500/25 transform transition hover:scale-105">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center border border-amber-400/40 relative overflow-hidden">
                    {/* Gloss sheen */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="font-mono text-3xl sm:text-4xl font-black text-amber-200 tracking-tight drop-shadow-md">
                      {digit}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-2 font-medium">
                  {i === 0 ? 'Space 1' : i === 1 ? 'Space 2' : 'Space 3'}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4 text-xs font-mono text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span>Sum: <strong className="text-amber-400 font-bold">{bestCombo.sum}</strong> (Root {bestCombo.rootSum})</span>
            <span className="text-slate-600">•</span>
            <span>{bestCombo.type.toUpperCase()}</span>
            <span className="text-slate-600">•</span>
            <span>{bestCombo.oddEven}</span>
            <span className="text-slate-600">•</span>
            <span>{bestCombo.highLow}</span>
          </div>
        </div>

        {/* Primary Metrics: Score & Rank */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Composite Model Score */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3.5 relative overflow-hidden">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              MODEL SCORE
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 mt-1">
              {bestCombo.straightScore.toFixed(2)}
              <span className="text-xs font-normal text-slate-500 ml-1">/ 100</span>
            </div>
            <div className="text-[10px] text-amber-400/80 mt-1">
              Ensemble aggregate confidence
            </div>
          </div>

          {/* Model Rank */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              MODEL RANK
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
              #1
              <span className="text-xs font-normal text-slate-500 ml-1">of 1,000</span>
            </div>
            <div className="text-[10px] text-emerald-400/80 mt-1">
              Outranks 99.9% of combinations
            </div>
          </div>

          {/* Model Estimated Probability */}
          <div className="bg-slate-950/80 border border-sky-500/30 rounded-xl p-3.5 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              EST. PROBABILITY
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-sky-400 mt-1">
              {(bestCombo.estimatedProb * 100).toFixed(3)}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              vs {(theoreticalProb * 100).toFixed(2)}% random baseline
            </div>
          </div>

          {/* Box & Mirror Info */}
          <div className="col-span-2 sm:col-span-3 bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Box Permutations ({bestCombo.boxForms.length}):</span>
              <div className="flex flex-wrap gap-1 font-mono text-amber-300 font-semibold">
                {bestCombo.boxForms.map(box => (
                  <span key={box} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {box}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Mirror Equivalent:</span>
              <span className="font-mono text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-950/50 border border-purple-800/60">
                {bestCombo.mirrors}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Breakdown: Individual Model Rankings Comparison */}
      <div className="mt-5 pt-5 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Independent Sub-Model Standings for {bestCombo.numberStr}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Final Weighted Consensus = #1
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {modelRankingBadges.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center ${item.color}`}
              >
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 mb-0.5">
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </div>
                <div className="text-base sm:text-lg font-mono font-black text-white">
                  #{item.rank}
                </div>
                <div className="text-[9px] text-slate-400">
                  out of 1000
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mathematical Reasoning & Component Breakdown */}
      <div className="mt-5 bg-slate-950/70 border border-slate-800/90 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
            <div className="font-semibold text-white flex items-center gap-2">
              <span>Mathematical Rationale for Selection:</span>
            </div>
            <p className="text-slate-300">
              {bestCombo.explanation}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono text-slate-400">
              <div>Positional Score: <strong className="text-slate-200">{bestCombo.componentScores.position.toFixed(1)}/100</strong></div>
              <div>Recency EWMA: <strong className="text-slate-200">{bestCombo.componentScores.recency.toFixed(1)}/100</strong></div>
              <div>Markov Transition: <strong className="text-slate-200">{bestCombo.componentScores.transition.toFixed(1)}/100</strong></div>
              <div>Overdue Index: <strong className="text-slate-200">{bestCombo.componentScores.overdue.toFixed(1)}/100</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Required Probability Warning Notice */}
      <div className="mt-4 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold text-amber-300 block">
            MATHEMATICAL TRANSPARENCY NOTICE (Gambler&apos;s Fallacy & Probability Boundary):
          </strong>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            In standard lottery systems utilizing unbiased physical ball machines or certified hardware random number generators (RNG),
            each combination from <strong>000 through 999</strong> possesses an exact theoretical probability of <strong>1 in 1,000 (0.100%)</strong> per drawing.
            The model score and rank above reflect <em>historical empirical patterns, positional recency, Markov transitions, and statistical biases</em> observed in the provided dataset, but <strong>no lottery prediction model can alter true mechanical randomness or guarantee future outcomes</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

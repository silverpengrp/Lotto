import React from 'react';
import { ModelWeights, CombinationScore } from '../types/lottery';
import {
  Activity,
  TrendingUp,
  Compass,
  GitBranch,
  Layers,
  Cpu,
  Award,
  Sliders,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

interface ModelEnsembleViewProps {
  weights: ModelWeights;
  onChangeWeights: (newWeights: ModelWeights) => void;
  bestCombo: CombinationScore | null;
  allScored: CombinationScore[];
  onReRun: () => void;
}

export const ModelEnsembleView: React.FC<ModelEnsembleViewProps> = ({
  weights,
  onChangeWeights,
  bestCombo,
  allScored,
  onReRun,
}) => {
  const modelsConfig = [
    {
      id: 'frequency' as keyof ModelWeights,
      name: 'Model A — Frequency Model',
      icon: Activity,
      desc: 'Position-specific (H/T/O) and digit pair historical densities.',
      color: 'text-sky-400 border-sky-800 bg-sky-950/30',
      rankField: 'frequency' as const,
    },
    {
      id: 'recency' as keyof ModelWeights,
      name: 'Model B — Recency & EWMA Model',
      icon: TrendingUp,
      desc: 'Exponential Weighted Moving Average (decay λ = 0.08) and short-term momentum.',
      color: 'text-amber-400 border-amber-800 bg-amber-950/30',
      rankField: 'recency' as const,
    },
    {
      id: 'bayesian' as keyof ModelWeights,
      name: 'Model C — Bayesian Dirichlet Model',
      icon: Compass,
      desc: 'Conjugate Dirichlet-Multinomial posterior marginal distribution.',
      color: 'text-purple-400 border-purple-800 bg-purple-950/30',
      rankField: 'bayesian' as const,
    },
    {
      id: 'markov' as keyof ModelWeights,
      name: 'Model D — Markov Transition Model',
      icon: GitBranch,
      desc: 'Order-1 conditional transition matrix P(X_t = j | X_{t-1} = i).',
      color: 'text-emerald-400 border-emerald-800 bg-emerald-950/30',
      rankField: 'markov' as const,
    },
    {
      id: 'pattern' as keyof ModelWeights,
      name: 'Model E — Pattern & Structure Model',
      icon: Layers,
      desc: 'Macro sum density distance, parity balance, and single/double combinatorics.',
      color: 'text-pink-400 border-pink-800 bg-pink-950/30',
      rankField: 'pattern' as const,
    },
    {
      id: 'monteCarlo' as keyof ModelWeights,
      name: 'Model F — Monte Carlo Simulator',
      icon: Cpu,
      desc: '15,000 synthetic future path simulations over Markov kernels.',
      color: 'text-cyan-400 border-cyan-800 bg-cyan-950/30',
      rankField: 'monteCarlo' as const,
    },
    {
      id: 'ml' as keyof ModelWeights,
      name: 'Model G — Machine Learning (L2 Ridge)',
      icon: Award,
      desc: 'Regularized multivariate linear score combining normalized features.',
      color: 'text-indigo-400 border-indigo-800 bg-indigo-950/30',
      rankField: 'ml' as const,
    },
  ];

  const handleWeightChange = (key: keyof ModelWeights, val: number) => {
    onChangeWeights({
      ...weights,
      [key]: val,
    });
  };

  const handleResetDefaults = () => {
    onChangeWeights({
      frequency: 0.15,
      recency: 0.18,
      bayesian: 0.14,
      markov: 0.16,
      pattern: 0.12,
      monteCarlo: 0.10,
      ml: 0.15,
      overfittingPenalty: 0.05,
    });
  };

  // Find top pick for each individual model
  const getTopPickForModel = (field: 'frequency' | 'recency' | 'bayesian' | 'markov' | 'pattern' | 'monteCarlo' | 'ml') => {
    const sorted = [...allScored].sort((a, b) => a.modelRanks[field] - b.modelRanks[field]);
    return sorted[0];
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 backdrop-blur">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              7-MODEL ENSEMBLE ARCHITECTURE
            </span>
            <span className="text-xs text-slate-400">
              Multi-Model Independent Ranking & Regularized Synthesis
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Independent Analytical Models & Parameter Tuning
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Weights</span>
          </button>
          <button
            onClick={onReRun}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-md transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Recalculate with Custom Weights</span>
          </button>
        </div>
      </div>

      {/* Primary Pick Breakdown across all 7 Models */}
      {bestCombo && (
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
              Overall Primary Pick #{bestCombo.ensembleRank}: <span className="text-amber-400 text-sm font-black">{bestCombo.numberStr}</span> Standings
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Ensemble Rank: <strong className="text-emerald-400">#1</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 font-mono text-xs">
            {modelsConfig.map(m => {
              const rank = bestCombo.modelRanks[m.rankField];
              return (
                <div key={m.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">{m.name.split('—')[1]}</div>
                  <div className="text-base font-black text-white mt-0.5">#{rank}</div>
                  <div className="text-[9px] text-slate-500">of 1,000</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7 Models Configuration & Weight Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modelsConfig.map(m => {
          const topPick = getTopPickForModel(m.rankField);
          const weightVal = weights[m.id] ?? 0.15;
          const Icon = m.icon;

          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${m.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-white text-xs">{m.name}</span>
                  </div>
                  {topPick && (
                    <span className="text-[11px] font-mono font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-slate-200">
                      Model #1: <strong className="text-amber-400">{topPick.numberStr}</strong>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              {/* Slider */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">Ensemble Weight:</span>
                  <span className="font-bold text-white">{(weightVal * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.01"
                  value={weightVal}
                  onChange={e => handleWeightChange(m.id, parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          );
        })}

        {/* Anti-Overfitting Penalty Card */}
        <div className="p-4 rounded-xl border border-rose-900/50 bg-rose-950/20 text-rose-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="font-bold text-white text-xs">Anti-Overfitting Penalty Regularization</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Deducts score from combinations with degenerate patterns (immediate back-to-back repeats, rare triples, zero dispersion) to guard against sample noise overfitting.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Penalty Factor:</span>
              <span className="font-bold text-rose-400">{(weights.overfittingPenalty * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.25"
              step="0.01"
              value={weights.overfittingPenalty}
              onChange={e => handleWeightChange('overfittingPenalty', parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

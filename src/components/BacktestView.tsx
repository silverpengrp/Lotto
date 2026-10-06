import React, { useState } from 'react';
import { BacktestResults, ModelWeights } from '../types/lottery';
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Sliders,
  History,
  ShieldCheck,
  RefreshCw,
  Zap,
  Info,
  Scale,
} from 'lucide-react';

interface BacktestViewProps {
  backtest: BacktestResults | null;
  weights: ModelWeights;
  onOptimizeWeights: () => void;
  onRunCustomBacktest: (windowCount: number) => void;
  isOptimizing: boolean;
}

export const BacktestView: React.FC<BacktestViewProps> = ({
  backtest,
  weights,
  onOptimizeWeights,
  onRunCustomBacktest,
  isOptimizing,
}) => {
  const [testWindow, setTestWindow] = useState<number>(40);
  const [logFilter, setLogFilter] = useState<'all' | 'top10' | 'box10'>('all');

  if (!backtest) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        No backtest computed yet. Click &apos;Run Advanced Analysis&apos; to execute rolling walk-forward backtesting.
      </div>
    );
  }

  const filteredLogs = backtest.logs.filter(log => {
    if (logFilter === 'top10') return log.straightHitTop10;
    if (logFilter === 'box10') return log.boxHitTop10;
    return true;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 backdrop-blur">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              WALK-FORWARD HISTORICAL BACKTESTING
            </span>
            <span className="text-xs text-slate-400">
              Strict Out-of-Sample Rolling Validation
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Empirical Prediction Accuracy vs. Null Random Hypothesis
          </h3>
        </div>

        {/* Action: Auto-Optimize Weights */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOptimizeWeights}
            disabled={isOptimizing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition disabled:opacity-50 active:scale-95"
          >
            <Zap className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing Weights...' : 'AUTO-OPTIMIZE WEIGHTS VIA BACKTESTING'}</span>
          </button>
        </div>
      </div>

      {/* Primary Verdict Banner: Predictive Power Evaluation */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          backtest.hasPredictivePower
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-black/30 shrink-0 mt-0.5">
            {backtest.hasPredictivePower ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <Scale className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-white">
              STATISTICAL PREDICTIVE POWER VERDICT:
              <span className={`ml-2 font-mono ${backtest.hasPredictivePower ? 'text-emerald-400' : 'text-amber-400'}`}>
                {backtest.hasPredictivePower
                  ? 'FAVORABLE EMPIRICAL EDGE DETECTED'
                  : 'CONSISTENT WITH RANDOM LOTTERY BASELINE (NULL HYPOTHESIS)'}
              </span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {backtest.hasPredictivePower
                ? `The model ranked actual historical outcomes with an average position of #${backtest.averageRank} (compared to 500.5 expected by chance), yielding a Z-Score of ${backtest.zScore} (p = ${backtest.pValueVersusRandom}). This demonstrates statistically meaningful out-of-sample pattern capture.`
                : `Actual historical outcomes achieved an average rank of #${backtest.averageRank} out of 1,000 (random expectation is #500.5). With p = ${backtest.pValueVersusRandom}, the observed deviation does not decisively falsify the uniform random lottery hypothesis at α = 0.05.`}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0 font-mono text-xs">
          <span className="text-slate-400">Tested Draw Windows:</span>
          <span className="text-xl font-black text-white">{backtest.drawsTested} Walks</span>
        </div>
      </div>

      {/* Key Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Average Rank */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Average Actual Rank</div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">
            #{backtest.averageRank}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Expected random: #500.5
          </div>
        </div>

        {/* Median Rank */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Median Actual Rank</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            #{backtest.medianRank}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            50th percentile rank
          </div>
        </div>

        {/* Top-10 Straight Hits */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Top 10 Straight Hits</div>
          <div className="text-2xl font-black font-mono text-sky-400 mt-1">
            {backtest.straightHitsTop10}
            <span className="text-xs font-normal text-slate-500 ml-1">
              ({((backtest.straightHitsTop10 / Math.max(1, backtest.drawsTested)) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Random expected: {backtest.randomExpectedTop10Hits} hits (1%)
          </div>
        </div>

        {/* Top-10 Box Hits */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Top 10 Box Hits</div>
          <div className="text-2xl font-black font-mono text-pink-400 mt-1">
            {backtest.boxHitsTop10}
            <span className="text-xs font-normal text-slate-500 ml-1">
              ({((backtest.boxHitsTop10 / Math.max(1, backtest.drawsTested)) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Any permutation match
          </div>
        </div>

        {/* Z-Score / Significance */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Statistical Z-Score</div>
          <div className="text-2xl font-black font-mono text-purple-400 mt-1">
            {backtest.zScore > 0 ? `+${backtest.zScore}` : backtest.zScore}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            p = {backtest.pValueVersusRandom}
          </div>
        </div>
      </div>

      {/* Hit Rate Hierarchy Table: Top 1, Top 5, Top 10, Top 25 */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
          Prediction Cutoff Hit Rates (Straight vs. Box Permutation)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase">Top-1 Selection</div>
            <div className="text-lg font-bold text-white mt-1">
              {backtest.straightHitsTop1} Straight / {backtest.boxHitsTop1} Box
            </div>
            <div className="text-[10px] text-slate-500">
              Expected random straight: 0.1%
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase">Top-5 Selections</div>
            <div className="text-lg font-bold text-white mt-1">
              {backtest.straightHitsTop5} Straight / {backtest.boxHitsTop5} Box
            </div>
            <div className="text-[10px] text-slate-500">
              Expected random straight: 0.5%
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase">Top-10 Selections</div>
            <div className="text-lg font-bold text-amber-300 mt-1">
              {backtest.straightHitsTop10} Straight / {backtest.boxHitsTop10} Box
            </div>
            <div className="text-[10px] text-slate-500">
              Expected random straight: 1.0%
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase">Top-25 Selections</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              {backtest.straightHitsTop25} Straight / {backtest.boxHitsTop25} Box
            </div>
            <div className="text-[10px] text-slate-500">
              Expected random straight: 2.5%
            </div>
          </div>
        </div>
      </div>

      {/* Historical Walk-Forward Draw Log */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              Walk-Forward Testing Log (Sequential Out-of-Sample Draws)
            </h4>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400">Filter:</span>
            <button
              onClick={() => setLogFilter('all')}
              className={`px-2.5 py-1 rounded border ${
                logFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              All ({backtest.logs.length})
            </button>
            <button
              onClick={() => setLogFilter('top10')}
              className={`px-2.5 py-1 rounded border ${
                logFilter === 'top10'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Top-10 Straight ({backtest.straightHitsTop10})
            </button>
            <button
              onClick={() => setLogFilter('box10')}
              className={`px-2.5 py-1 rounded border ${
                logFilter === 'box10'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Top-10 Box ({backtest.boxHitsTop10})
            </button>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Actual Result</th>
                <th className="py-2.5 px-3">Predicted Top 1</th>
                <th className="py-2.5 px-3">Actual Model Rank</th>
                <th className="py-2.5 px-3">Straight In Top 10?</th>
                <th className="py-2.5 px-3">Box In Top 10?</th>
                <th className="py-2.5 px-3 text-right">Digits Matched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(log => (
                <tr key={log.drawIndex} className="hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-3 text-slate-400">{log.drawDate}</td>
                  <td className="py-2.5 px-3 font-black text-white text-sm">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                      {log.drawNumberStr}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">{log.predictedTop1}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-bold ${
                        log.actualRank <= 10
                          ? 'text-emerald-400 font-black'
                          : log.actualRank <= 50
                          ? 'text-sky-400'
                          : log.actualRank <= 250
                          ? 'text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      #{log.actualRank}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {log.straightHitTop10 ? (
                      <span className="text-emerald-400 font-bold">YES (Straight)</span>
                    ) : (
                      <span className="text-slate-600">No</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {log.boxHitTop10 ? (
                      <span className="text-pink-400 font-bold">YES (Box)</span>
                    ) : (
                      <span className="text-slate-600">No</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-slate-300">{log.digitsMatchedWithTop1} / 3</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

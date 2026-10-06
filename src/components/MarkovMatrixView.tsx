import React, { useState } from 'react';
import { MarkovTransitionStats, Pick3Draw } from '../types/lottery';
import { GitBranch, Info, Sparkles } from 'lucide-react';

interface MarkovMatrixViewProps {
  markov: MarkovTransitionStats;
  lastDraw?: Pick3Draw;
}

export const MarkovMatrixView: React.FC<MarkovMatrixViewProps> = ({ markov, lastDraw }) => {
  const [activePos, setActivePos] = useState<'hundreds' | 'tens' | 'ones' | 'overall'>('hundreds');
  const [hoveredCell, setHoveredCell] = useState<{ from: number; to: number; prob: number } | null>(null);

  const matrix =
    activePos === 'hundreds'
      ? markov.hundredsMatrix
      : activePos === 'tens'
      ? markov.tensMatrix
      : activePos === 'ones'
      ? markov.onesMatrix
      : markov.overallMatrix;

  const lastDigit =
    lastDraw
      ? activePos === 'hundreds'
        ? lastDraw.d1
        : activePos === 'tens'
        ? lastDraw.d2
        : activePos === 'ones'
        ? lastDraw.d3
        : null
      : null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 backdrop-blur">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              MARKOV TRANSITION STATE MACHINE
            </span>
            <span className="text-xs text-slate-400">
              Conditional Probability Kernel: P(X_t = j | X_t-1 = i)
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Order-1 Markov Chain Digit Transition Matrix (10 × 10)
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {(['hundreds', 'tens', 'ones', 'overall'] as const).map(p => (
            <button
              key={p}
              onClick={() => setActivePos(p)}
              className={`px-3 py-1 rounded-lg capitalize font-bold transition ${
                activePos === p
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === 'hundreds' ? 'Hundreds (D1)' : p === 'tens' ? 'Tens (D2)' : p === 'ones' ? 'Ones (D3)' : 'All Positions'}
            </button>
          ))}
        </div>
      </div>

      {/* Narrative & Active Last-Draw Highlight */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Rows represent the <strong>previous draw&apos;s digit (t-1)</strong>; columns represent the <strong>subsequent draw&apos;s digit (t)</strong>.
          </span>
        </div>
        {lastDigit !== null && (
          <div className="flex items-center gap-2 font-mono bg-emerald-950/50 border border-emerald-800/80 px-3 py-1.5 rounded-lg text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Active Row from Last Draw: <strong>Digit {lastDigit}</strong>
            </span>
          </div>
        )}
      </div>

      {/* 10x10 Heatmap Matrix */}
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-11 gap-1 text-center font-mono text-xs">
            {/* Header Column: Empty top-left corner */}
            <div className="p-2 text-[10px] text-slate-500 font-bold">
              t-1 \ t
            </div>
            {/* Column headers (0 to 9) */}
            {Array.from({ length: 10 }, (_, j) => (
              <div key={j} className="p-2 text-amber-400 font-bold bg-slate-950 rounded">
                D = {j}
              </div>
            ))}

            {/* Rows (0 to 9) */}
            {Array.from({ length: 10 }, (_, i) => {
              const isLastDigitRow = lastDigit === i;
              return (
                <React.Fragment key={i}>
                  {/* Row Header */}
                  <div
                    className={`p-2 font-bold rounded flex items-center justify-center ${
                      isLastDigitRow
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-950 text-slate-300'
                    }`}
                  >
                    D = {i}
                  </div>

                  {/* 10 Cells */}
                  {Array.from({ length: 10 }, (_, j) => {
                    const prob = matrix[i][j];
                    const pct = prob * 100;
                    // Neutral probability is 10% (0.10)
                    const intensity = Math.min(1, Math.max(0, (prob - 0.04) / 0.16));

                    return (
                      <div
                        key={j}
                        onMouseEnter={() => setHoveredCell({ from: i, to: j, prob })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`p-2 rounded text-[11px] font-mono font-medium transition cursor-pointer relative group border ${
                          isLastDigitRow
                            ? 'border-emerald-500/60 ring-1 ring-emerald-500/30'
                            : 'border-slate-800/80 hover:border-emerald-400'
                        }`}
                        style={{
                          backgroundColor: `rgba(16, 185, 129, ${Math.max(0.06, intensity * 0.6)})`,
                          color: intensity > 0.4 ? '#ffffff' : '#94a3b8',
                        }}
                      >
                        {pct.toFixed(1)}%
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover Inspect Banner */}
      <div className="h-8 flex items-center justify-between text-xs font-mono text-slate-400 px-2">
        {hoveredCell ? (
          <div className="text-emerald-300 flex items-center gap-2">
            <span>
              Conditional Transition: P(Next Digit = <strong>{hoveredCell.to}</strong> | Prior Digit = <strong>{hoveredCell.from}</strong>) =
            </span>
            <span className="text-white font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {(hoveredCell.prob * 100).toFixed(2)}%
            </span>
            <span className="text-slate-500 text-[11px]">
              ({hoveredCell.prob > 0.1 ? 'Higher' : 'Lower'} than uniform 10.0%)
            </span>
          </div>
        ) : (
          <span className="text-slate-500">
            Hover over any transition cell to view precise conditional mathematical probability.
          </span>
        )}
      </div>
    </div>
  );
};

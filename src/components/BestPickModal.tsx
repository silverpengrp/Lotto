import React, { useState } from 'react';
import { CombinationScore, Pick3Draw } from '../types/lottery';
import {
  X,
  Sparkles,
  Copy,
  Check,
  ShieldAlert,
  Activity,
  TrendingUp,
  Compass,
  GitBranch,
  Layers,
  Cpu,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BestPickModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestCombo: CombinationScore | null;
  lastDraw?: Pick3Draw;
}

export const BestPickModal: React.FC<BestPickModalProps> = ({
  isOpen,
  onClose,
  bestCombo,
  lastDraw,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !bestCombo) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bestCombo.numberStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const modelStandings = [
    { label: 'Frequency', rank: bestCombo.modelRanks.frequency, icon: Activity },
    { label: 'Recency', rank: bestCombo.modelRanks.recency, icon: TrendingUp },
    { label: 'Bayesian', rank: bestCombo.modelRanks.bayesian, icon: Compass },
    { label: 'Markov', rank: bestCombo.modelRanks.markov, icon: GitBranch },
    { label: 'Pattern', rank: bestCombo.modelRanks.pattern, icon: Layers },
    { label: 'Monte Carlo', rank: bestCombo.modelRanks.monteCarlo, icon: Cpu },
    { label: 'ML Ridge', rank: bestCombo.modelRanks.ml, icon: Award },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MODEL&apos;S HIGHEST-RANKED COMBINATION</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Primary Consensus Selection
          </h2>
          <p className="text-xs text-slate-400">
            Synthesized across 7 independent mathematical lottery models
          </p>
        </div>

        {/* 3 Balls Visual */}
        <div className="flex justify-center items-center gap-3.5 sm:gap-4 my-6">
          {[
            bestCombo.rawD1 ?? bestCombo.d1,
            bestCombo.rawD2 ?? bestCombo.d2,
            bestCombo.rawD3 ?? bestCombo.d3,
          ].map((digit, i) => (
            <div
              key={i}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 p-1 shadow-xl shadow-amber-500/30 animate-in zoom-in-50"
            >
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center border border-amber-400/50 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                <span className="font-mono text-3xl sm:text-4xl font-black text-amber-200">
                  {digit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Score & Rank Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-5 font-mono text-center">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Model Score</div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
              {bestCombo.straightScore.toFixed(2)}
            </div>
            <div className="text-[9px] text-slate-500">/ 100.00</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30">
            <div className="text-[10px] text-slate-400 uppercase">Model Rank</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
              #1
            </div>
            <div className="text-[9px] text-emerald-500">Top of 1,000</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Est. Prob</div>
            <div className="text-xl sm:text-2xl font-black text-sky-400 mt-0.5">
              {(bestCombo.estimatedProb * 100).toFixed(3)}%
            </div>
            <div className="text-[9px] text-slate-500">vs 0.100% random</div>
          </div>
        </div>

        {/* Individual Model Rankings Checklist */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 block font-semibold">
            Sub-Model Standings for {bestCombo.numberStr}:
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 font-mono text-center text-xs">
            {modelStandings.map(item => (
              <div key={item.label} className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="text-[9px] text-slate-400">{item.label}</div>
                <div className="font-bold text-white text-xs mt-0.5">#{item.rank}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy & Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED NUMBER!' : `COPY NUMBER "${bestCombo.numberStr}"`}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Done
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-slate-500 text-center mt-4 leading-normal">
          Analytical prediction only. Lotteries are random games of chance; no prediction is guaranteed.
        </p>
      </div>
    </div>
  );
};

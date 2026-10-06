import React, { useState } from 'react';
import { DigitPositionStats, OverallDigitStats } from '../types/lottery';
import { Flame, Snowflake, Clock, TrendingUp, BarChart2, ShieldCheck, Check } from 'lucide-react';

interface DigitAnalyticsViewProps {
  hundreds: DigitPositionStats[];
  tens: DigitPositionStats[];
  ones: DigitPositionStats[];
  overall: OverallDigitStats[];
}

export const DigitAnalyticsView: React.FC<DigitAnalyticsViewProps> = ({
  hundreds,
  tens,
  ones,
  overall,
}) => {
  const [activeTab, setActiveTab] = useState<'position' | 'overall'>('position');
  const [selectedPos, setSelectedPos] = useState<'hundreds' | 'tens' | 'ones'>('hundreds');

  const activePositionStats =
    selectedPos === 'hundreds' ? hundreds : selectedPos === 'tens' ? tens : ones;

  // Max frequency for bar scaling
  const maxPosFreq = Math.max(...activePositionStats.map(s => s.frequency), 15);
  const maxOverallFreq = Math.max(...overall.map(s => s.frequency), 15);

  const getStatusBadge = (status: DigitPositionStats['status']) => {
    switch (status) {
      case 'hot':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Flame className="w-3 h-3 text-rose-400" />
            HOT
          </span>
        );
      case 'cold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Snowflake className="w-3 h-3 text-sky-400" />
            COLD
          </span>
        );
      case 'due':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
            DUE (OVERDUE)
          </span>
        );
      default:
        return (
          <span className="text-[10px] text-slate-500 font-mono">
            NEUTRAL
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 backdrop-blur">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              DIGIT & POSITION ANALYTICS
            </span>
            <span className="text-xs text-slate-400">
              Positional Frequencies, Skips, EWMA & Momentum
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Digit Behavior Across 10 Single Digits (0–9)
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('position')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'position'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Position Breakdown (H / T / O)
          </button>
          <button
            onClick={() => setActiveTab('overall')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'overall'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overall Aggregate (All Positions)
          </button>
        </div>
      </div>

      {activeTab === 'position' ? (
        <div className="space-y-5">
          {/* Sub-Position Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Position:</span>
            {(['hundreds', 'tens', 'ones'] as const).map(pos => (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold capitalize transition border ${
                  selectedPos === pos
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {pos === 'hundreds' ? 'Hundreds (D1)' : pos === 'tens' ? 'Tens (D2)' : 'Ones (D3)'}
              </button>
            ))}
          </div>

          {/* Graphical Histogram */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-mono">Distribution Histogram (Expected baseline = 10.0%)</span>
              <span className="text-amber-400 font-mono">Dashed line = 10% theoretical</span>
            </div>

            <div className="grid grid-cols-10 gap-2 items-end h-44 pt-4 px-2 relative border-b border-slate-800">
              {/* 10% Reference line */}
              <div
                className="absolute inset-x-0 border-b border-dashed border-amber-500/40 pointer-events-none"
                style={{ bottom: `${(10.0 / maxPosFreq) * 100}%` }}
              >
                <span className="absolute right-1 -top-4 text-[9px] font-mono text-amber-400/80">10%</span>
              </div>

              {activePositionStats.map(stat => {
                const heightPct = (stat.frequency / maxPosFreq) * 100;
                const isOver = stat.frequency > 10;
                return (
                  <div key={stat.digit} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono font-semibold text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition">
                      {stat.frequency.toFixed(1)}%
                    </span>
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 relative ${
                        stat.status === 'hot'
                          ? 'bg-gradient-to-t from-rose-600 to-rose-400'
                          : stat.status === 'due'
                          ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                          : isOver
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                          : 'bg-gradient-to-t from-slate-700 to-slate-500'
                      }`}
                      style={{ height: `${Math.max(6, heightPct)}%` }}
                    />
                    <span className="font-mono font-black text-sm text-white mt-2 group-hover:text-amber-400">
                      {stat.digit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Position Stats Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-950/60">
                  <th className="py-2.5 px-3">Digit</th>
                  <th className="py-2.5 px-3">Hits</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Current Skip</th>
                  <th className="py-2.5 px-3">Avg / Max Skip</th>
                  <th className="py-2.5 px-3">Last 10 Draws</th>
                  <th className="py-2.5 px-3">EWMA Decay</th>
                  <th className="py-2.5 px-3">Momentum</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activePositionStats.map(stat => (
                  <tr key={stat.digit} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 font-black text-white text-sm">
                      <span className="w-6 h-6 rounded bg-slate-800 inline-flex items-center justify-center border border-slate-700">
                        {stat.digit}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-semibold">{stat.count}</td>
                    <td className="py-2.5 px-3">
                      <span className={stat.frequency >= 10 ? 'text-emerald-400' : 'text-slate-400'}>
                        {stat.frequency.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          stat.currentSkip >= stat.avgSkip * 1.5 ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        {stat.currentSkip} draws
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {stat.avgSkip} / {stat.maxSkip}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-sky-400">{stat.recentCount10}</span>
                      <span className="text-slate-500 text-[10px] ml-1">/ 10</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{stat.ewma.toFixed(2)}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          stat.momentum >= 1.5
                            ? 'text-rose-400'
                            : stat.momentum < 0.7
                            ? 'text-sky-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {stat.momentum.toFixed(2)}x
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {getStatusBadge(stat.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Overall Aggregate Tab */
        <div className="space-y-5">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 mb-3 font-mono">
              Total Occurrences Across All 3 Positions (Combined Digit Pool)
            </div>

            <div className="grid grid-cols-10 gap-2 items-end h-44 pt-4 px-2 relative border-b border-slate-800">
              <div
                className="absolute inset-x-0 border-b border-dashed border-amber-500/40 pointer-events-none"
                style={{ bottom: `${(10.0 / maxOverallFreq) * 100}%` }}
              >
                <span className="absolute right-1 -top-4 text-[9px] font-mono text-amber-400/80">10% Expected</span>
              </div>

              {overall.map(stat => {
                const heightPct = (stat.frequency / maxOverallFreq) * 100;
                return (
                  <div key={stat.digit} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono font-semibold text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition">
                      {stat.frequency.toFixed(1)}%
                    </span>
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        stat.status === 'hot'
                          ? 'bg-gradient-to-t from-rose-600 to-rose-400'
                          : stat.status === 'due'
                          ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                          : 'bg-gradient-to-t from-sky-600 to-sky-400'
                      }`}
                      style={{ height: `${Math.max(6, heightPct)}%` }}
                    />
                    <span className="font-mono font-black text-sm text-white mt-2 group-hover:text-amber-400">
                      {stat.digit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-950/60">
                  <th className="py-2.5 px-3">Digit</th>
                  <th className="py-2.5 px-3">Total Hits</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Positional (H / T / O)</th>
                  <th className="py-2.5 px-3">Current Skip</th>
                  <th className="py-2.5 px-3">Avg / Max Skip</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {overall.map(stat => (
                  <tr key={stat.digit} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 font-black text-white text-sm">
                      <span className="w-6 h-6 rounded bg-slate-800 inline-flex items-center justify-center border border-slate-700">
                        {stat.digit}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-semibold">{stat.totalCount}</td>
                    <td className="py-2.5 px-3 text-sky-400 font-bold">{stat.frequency.toFixed(2)}%</td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <span className="text-amber-400">{stat.positions.hundreds}</span> /{' '}
                      <span className="text-emerald-400">{stat.positions.tens}</span> /{' '}
                      <span className="text-sky-400">{stat.positions.ones}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          stat.currentSkip >= stat.avgSkip * 1.6 ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        {stat.currentSkip} draws
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {stat.avgSkip} / {stat.maxSkip}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {getStatusBadge(stat.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

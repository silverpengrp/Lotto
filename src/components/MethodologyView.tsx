import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, GitBranch, Compass, Cpu, Activity, TrendingUp, Layers } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-7 backdrop-blur">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            MATHEMATICAL TRANSPARENCY & ENGINE METHODOLOGY
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mt-1">
          Rigorous Statistical Architecture & Formula Breakdown
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Every component of the prediction score is grounded in verifiable probability theory, combinatorics, and machine learning principles.
        </p>
      </div>

      {/* Critical Probability Boundary Warning */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <ShieldAlert className="w-4 h-4" />
          <span>Scientific Lottery Probability Boundary</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          The system strictly distinguishes between <strong>Mathematical/Model Score</strong>, <strong>Historical Frequency</strong>, <strong>Estimated Model Probability</strong>, and <strong>Actual Lottery Draw Probability</strong>.
          In a physical lottery drawing (e.g. 3 mechanical drums each containing 10 ping-pong balls marked 0–9), each combination is physically independent and identically distributed with a constant probability of <em>P(E) = 1/1000 = 0.001</em>.
          This model analyzes empirical departures, momentum, and state transitions in historical data without manufacturing fictitious certainty.
        </p>
      </div>

      {/* 7 Models Detailed Formulations */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>The Seven Independent Analytical Models</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Model A */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-sans">
            <div className="flex items-center gap-2 font-bold text-sky-400">
              <Activity className="w-4 h-4" />
              <span>Model A — Positional Frequency & Pair Density</span>
            </div>
            <p className="text-slate-300">
              Evaluates the marginal frequency of digits <em>d₁, d₂, d₃</em> conditioned on their specific positions (Hundreds, Tens, Ones), plus front-pair (D1-D2), back-pair (D2-D3), and split-pair (D1-D3) co-occurrence density.
            </p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
              Score_A(X) = 0.65 × PosFreq(d₁, d₂, d₃) + 0.35 × PairDensity(X)
            </div>
          </div>

          {/* Model B */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-sans">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <TrendingUp className="w-4 h-4" />
              <span>Model B — Recency & EWMA Decay Model</span>
            </div>
            <p className="text-slate-300">
              Computes an Exponential Weighted Moving Average (EWMA) with smoothing decay parameter <em>λ = 0.08</em>, giving recent occurrences exponentially higher weight than distant draws.
            </p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
              {"EWMA(d) = ∑_{t=1}^N exp(-λ(N - t)) · 𝕀(X_t = d)"}
            </div>
          </div>

          {/* Model C */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-sans">
            <div className="flex items-center gap-2 font-bold text-purple-400">
              <Compass className="w-4 h-4" />
              <span>Model C — Bayesian Dirichlet-Multinomial Model</span>
            </div>
            <p className="text-slate-300">
              Applies a uniform Dirichlet conjugate prior <em>Dir(α = 1, ..., 1)</em> to the multinomial digit outcomes, preventing zero-frequency likelihood collapse and deriving the posterior expected marginal probability.
            </p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
              {"𝔼[P(D=k) | Data] = (Count_k + 1) / (N + 10)"}
            </div>
          </div>

          {/* Model D */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-sans">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <GitBranch className="w-4 h-4" />
              <span>Model D — Markov Chain State Transition</span>
            </div>
            <p className="text-slate-300">
              Constructs a 10×10 stochastic transition matrix per position, evaluating conditional transition probabilities <em>{"P(X_t = j | X_{t-1} = i)"}</em> with Laplace smoothing given the immediate prior draw.
            </p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
              {"T_{i,j} = (Counts_{i→j} + 0.5) / (∑ Counts_i + 5.0)"}
            </div>
          </div>

          {/* Model E */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-sans">
            <div className="flex items-center gap-2 font-bold text-pink-400">
              <Layers className="w-4 h-4" />
              <span>Model E — Pattern & Macro Combinatorics</span>
            </div>
            <p className="text-slate-300">
              Tests candidate alignment against the theoretical sum binomial curve (mean 13.5), odd/even parity ratios (37.5% for 2O1E and 1O2E), and structural single/double/triple ratios (72% singles, 27% doubles, 1% triples).
            </p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
              {"Score_E(X) = 0.4·P(Sum) + 0.3·P(Type) + 0.3·P(Parity & High/Low)"}
            </div>
          </div>

          {/* Model F */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-sans">
            <div className="flex items-center gap-2 font-bold text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span>Model F — Monte Carlo Path Simulation</span>
            </div>
            <p className="text-slate-300">
              Simulates 15,000 independent future trials using the empirical transition kernels and bootstrapped draw histories, tallying realization frequencies across all 1,000 candidates.
            </p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
              {"Score_F(X) = SimOccurrences(X) / 15,000"}
            </div>
          </div>

          {/* Model G */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-sans md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-indigo-400">
              <BookOpen className="w-4 h-4" />
              <span>Model G — Regularized Machine Learning (Ridge Linear Scoring)</span>
            </div>
            <p className="text-slate-300">
              Extracts a continuous feature vector encompassing normalized positional ranks, skip ratios, momentum factors, and transition likelihoods. An L2 ridge regularization penalty is enforced to suppress spurious correlation amplification.
            </p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
              {"Score_G(X) = w^T · Φ(X) - λ_{L2} ||w||_2^2"}
            </div>
          </div>
        </div>
      </div>

      {/* Anti-Overfitting Safeguards */}
      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
        <h4 className="font-bold text-white text-sm">
          Anti-Overfitting Methodology & Walk-Forward Validation
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-amber-400 block font-mono">1. Walk-Forward Backtesting</strong>
            <p>
              Draw <em>t</em> is strictly hidden while the models are trained solely on draws <em>0 ... t-1</em>. The model has zero forward leak.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-emerald-400 block font-mono">2. Regularization Penalties</strong>
            <p>
              An explicit penalty score deduces points from degenerate outcomes (e.g. triples with 1% baseline or duplicate draws).
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-sky-400 block font-mono">3. Statistical Significance</strong>
            <p>
              Standard Z-Scores and Chi-Square p-values test whether model rankings exceed the 1/1,000 random chance benchmark.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

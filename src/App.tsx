/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Pick3Draw, ModelWeights, CombinationScore, BacktestResults } from './types/lottery';
import { PRELOADED_DATASETS, createDraw } from './data/sampleDatasets';
import {
  calculateDigitStats,
  calculatePairStats,
  calculateMarkovTransitions,
  calculatePatternStats,
  scoreAllCombinations,
  runRollingBacktest,
} from './engine/lotteryEngine';
import { QuickLastDrawBar } from './components/QuickLastDrawBar';
import { SimpleResultsView } from './components/SimpleResultsView';
import { Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Estado que rastrea si el usuario ya solicitó calcular el próximo sorteo
  const [hasCalculated, setHasCalculated] = useState(false);

  // Conjunto de datos base
  const [allDraws, setAllDraws] = useState<Pick3Draw[]>(() => PRELOADED_DATASETS.texas.draws);
  const windowSize = 100;

  // Ponderaciones del ensamble del modelo
  const [weights] = useState<ModelWeights>({
    frequency: 0.15,
    recency: 0.18,
    bayesian: 0.14,
    markov: 0.16,
    pattern: 0.12,
    monteCarlo: 0.10,
    ml: 0.15,
    overfittingPenalty: 0.05,
  });

  // Indicador de análisis
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Ventana activa de sorteos
  const activeDraws = useMemo(() => {
    if (windowSize >= allDraws.length) return allDraws;
    return allDraws.slice(-windowSize);
  }, [allDraws, windowSize]);

  const lastDraw = activeDraws[activeDraws.length - 1];

  // Cálculos estadísticos
  const digitStats = useMemo(() => calculateDigitStats(activeDraws), [activeDraws]);

  // Resultados del modelo
  const [bestCombo, setBestCombo] = useState<CombinationScore | null>(null);

  // Ejecutar análisis matemático
  const executeAnalysis = useCallback((drawsToUse: Pick3Draw[], currentWeights: ModelWeights) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Puntuar las 1,000 combinaciones y obtener el candidato principal
      const { bestCombination: best } = scoreAllCombinations(
        drawsToUse,
        currentWeights
      );
      setBestCombo(best);
      setIsAnalyzing(false);
    }, 50);
  }, []);

  // Ejecutar al montar y cuando cambian los sorteos
  useEffect(() => {
    executeAnalysis(activeDraws, weights);
  }, [activeDraws, weights, executeAnalysis]);

  // Manejar entrada de números del último sorteo
  const handleApplyLastDraw = (numberStr: string, saveToHistory: boolean) => {
    const newDraw = createDraw(
      `draw-${Date.now()}`,
      new Date().toISOString().split('T')[0],
      'Evening',
      numberStr,
      allDraws.length + 1
    );

    let updatedDraws: Pick3Draw[];
    if (saveToHistory) {
      updatedDraws = [...allDraws, newDraw];
    } else {
      updatedDraws = [...allDraws.slice(0, -1), newDraw];
    }

    setAllDraws(updatedDraws);
    setHasCalculated(true);
    confetti({ particleCount: 50, spread: 65, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    setHasCalculated(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Encabezado Limpio en Español */}
      <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur py-3.5 px-4 sm:px-6 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-mono font-black text-slate-950 text-base shadow-md shadow-amber-500/20">
              3X
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Generador de Pronósticos Pick 3
              </h1>
              <p className="text-xs text-slate-400">
                Análisis matemático y estadístico para el próximo sorteo
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Sección de Ingreso de Números */}
        <QuickLastDrawBar
          lastDraw={lastDraw}
          onApplyLastDraw={handleApplyLastDraw}
          isAnalyzing={isAnalyzing}
          onClear={handleReset}
        />

        {/* Sección de Resultados */}
        {!hasCalculated ? (
          /* Pantalla Inicial antes de solicitar resultados */
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Listo para Generar el Pronóstico</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Ingresa los números ganadores del último sorteo en las 3 casillas de arriba (por ejemplo:{' '}
              <strong className="text-amber-300 font-mono">12 - 45 - 13</strong> o{' '}
              <strong className="text-slate-300 font-mono">7 - 4 - 2</strong>) y pulsa en{' '}
              <strong className="text-white">OBTENER RESULTADOS DEL PRÓXIMO SORTEO</strong>.
            </p>
          </div>
        ) : (
          /* Vista de Resultados en Español */
          <SimpleResultsView
            bestCombo={bestCombo}
            lastDraw={lastDraw}
            overallDigits={digitStats.overall}
            onNewDraw={handleReset}
          />
        )}
      </main>

      {/* Pie de Página en Español */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center font-mono mt-auto">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p>
            Motor de Pronósticos y Análisis Estadístico &copy; 2026. Basado en Cadenas de Márkov y Modelos de Transición.
          </p>
          <p className="text-[11px] text-slate-600">
            Aviso: Cada combinación tiene una probabilidad teórica independiente de 1 en 1,000 (0.100%). Desarrollado para análisis e investigación.
          </p>
        </div>
      </footer>
    </div>
  );
}

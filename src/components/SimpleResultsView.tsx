import React, { useState } from 'react';
import { CombinationScore, OverallDigitStats, Pick3Draw } from '../types/lottery';
import {
  Sparkles,
  Copy,
  Check,
  Flame,
  Clock,
  Snowflake,
  ShieldCheck,
  RotateCcw,
  TrendingUp,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimpleResultsViewProps {
  bestCombo: CombinationScore | null;
  lastDraw?: Pick3Draw;
  overallDigits: OverallDigitStats[];
  onNewDraw?: () => void;
}

export const SimpleResultsView: React.FC<SimpleResultsViewProps> = ({
  bestCombo,
  lastDraw,
  overallDigits,
  onNewDraw,
}) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [showExtraDetails, setShowExtraDetails] = useState(false);

  if (!bestCombo) return null;

  const handleCopy = (numStr: string) => {
    navigator.clipboard.writeText(numStr);
    setCopiedNumber(numStr);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Extraer dígitos calientes, atrasados y fríos
  const hotDigits = overallDigits.filter(d => d.status === 'hot').map(d => d.digit);
  const dueDigits = overallDigits.filter(d => d.status === 'due').map(d => d.digit);
  const coldDigits = overallDigits.filter(d => d.status === 'cold').map(d => d.digit);

  // Valores a mostrar en las 3 bolas
  const ballValues = [
    bestCombo.rawD1 !== undefined ? bestCombo.rawD1.toString().padStart(bestCombo.isTwoDigit ? 2 : 1, '0') : bestCombo.d1,
    bestCombo.rawD2 !== undefined ? bestCombo.rawD2.toString().padStart(bestCombo.isTwoDigit ? 2 : 1, '0') : bestCombo.d2,
    bestCombo.rawD3 !== undefined ? bestCombo.rawD3.toString().padStart(bestCombo.isTwoDigit ? 2 : 1, '0') : bestCombo.d3,
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Tarjeta Principal con el Resultado Ganador Recomendado */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Resplandor decorativo */}
        <div className="absolute -top-24 right-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Información y Números */}
          <div className="space-y-4 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JUGADA RECOMENDADA PARA EL PRÓXIMO SORTEO</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Número Ganador Recomendado
              </h3>
              {lastDraw && (
                <p className="text-xs sm:text-sm text-slate-400">
                  Calculado matemáticamente tras el último sorteo:{' '}
                  <strong className="text-amber-300 font-mono text-sm">{lastDraw.numberStr}</strong>
                </p>
              )}
            </div>

            {/* Visualización de las 3 Casillas / Bolas */}
            <div className="flex items-center gap-3 sm:gap-4 pt-2">
              {ballValues.map((val, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 p-1 shadow-lg shadow-amber-500/25 transform transition hover:scale-105">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center border border-amber-400/50 relative overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
                      <span className="font-mono text-3xl sm:text-4xl font-black text-amber-200">
                        {val}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold uppercase tracking-wider">
                    Casilla {i + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Equivalencias y detalles si es 2 dígitos */}
            {bestCombo.isTwoDigit && (
              <div className="text-xs font-mono text-amber-300/90 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20 inline-flex flex-wrap items-center gap-3">
                <span>
                  Combinación: <strong className="text-white">{bestCombo.numberStr}</strong>
                </span>
                <span className="text-slate-600">|</span>
                <span>
                  Suma Total = <strong className="text-white">{bestCombo.sum}</strong>
                </span>
                <span className="text-slate-600">|</span>
                <span>
                  Suma Raíz = <strong className="text-white">{bestCombo.rootSum}</strong>
                </span>
              </div>
            )}

            {/* Botón de Copiar y Métricas Rápidas */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleCopy(bestCombo.numberStr);
                  triggerCelebration();
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                {copiedNumber === bestCombo.numberStr ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡NÚMERO COPIADO!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPIAR JUGADA ({bestCombo.numberStr})</span>
                  </>
                )}
              </button>

              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                Suma: <strong className="text-white">{bestCombo.sum}</strong> • Paridad:{' '}
                <strong className="text-white">
                  {bestCombo.oddEven.replace('O', ' Impares / ').replace('E', ' Pares')}
                </strong>
              </span>
            </div>
          </div>

          {/* Cuadro Lateral: Fuerza y Justificación Matemática */}
          <div className="bg-slate-950/85 p-5 rounded-2xl border border-slate-800 space-y-4 max-w-sm w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
                  Fuerza del Modelo
                </span>
                <span className="text-2xl font-black font-mono text-amber-300">
                  {bestCombo.straightScore.toFixed(1)}{' '}
                  <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
                  Rango del Modelo
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  #1{' '}
                  <span className="text-xs text-slate-500 font-normal">de 1,000</span>
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-white block">¿Por qué este número?:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {bestCombo.explanation}
              </p>
            </div>

            {/* Desplegable de Detalles Matemáticos Adicionales (Opcional) */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold block">
                Combinaciones en Desorden (Jugada Box / Cualquiera):
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {bestCombo.boxForms.map(box => (
                  <span
                    key={box}
                    className={`px-2 py-1 rounded-lg font-bold ${
                      box === bestCombo.numberStr
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-900 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {box}
                  </span>
                ))}
              </div>
            </div>

            {/* Ficha de Matemáticas Cuánticas */}
            <div className="pt-3 border-t border-slate-800/80 bg-slate-900/50 -mx-2 px-3 py-2.5 rounded-xl border border-indigo-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  Modelo de Matemáticas Cuánticas
                </span>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">
                  {bestCombo.componentScores.quantum.toFixed(1)} / 100
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                <span>Coherencia Cuántica:</span>
                <span className="text-emerald-400 font-bold">{bestCombo.quantumCoherence ?? 88}%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                <span>Interferencia:</span>
                <span className="text-cyan-300 font-semibold">
                  {bestCombo.quantumConstructive ? 'Constructiva (Amplificación)' : 'Destructiva'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Resumen de Números Calientes, Atrasados y Fríos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Números Calientes */}
        <div className="bg-slate-900/90 border border-rose-900/40 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Flame className="w-4 h-4" />
            <span>Números Calientes (Alta Frecuencia)</span>
          </div>
          <p className="text-xs text-slate-400">
            Dígitos que han salido con mayor frecuencia en sorteos recientes:
          </p>
          <div className="flex items-center gap-2 pt-1">
            {hotDigits.length > 0 ? (
              hotDigits.map(d => (
                <span
                  key={d}
                  className="w-10 h-10 rounded-xl bg-gradient-to-t from-rose-600 to-rose-400 text-white font-mono font-black text-xl flex items-center justify-center shadow-md shadow-rose-500/20"
                >
                  {d}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">Sin números calientes extremos</span>
            )}
          </div>
        </div>

        {/* Números Atrasados */}
        <div className="bg-slate-900/90 border border-amber-900/40 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Clock className="w-4 h-4" />
            <span>Números Atrasados (Por Salir)</span>
          </div>
          <p className="text-xs text-slate-400">
            Dígitos que llevan mayor cantidad de sorteos sin aparecer:
          </p>
          <div className="flex items-center gap-2 pt-1">
            {dueDigits.length > 0 ? (
              dueDigits.map(d => (
                <span
                  key={d}
                  className="w-10 h-10 rounded-xl bg-gradient-to-t from-amber-600 to-amber-400 text-slate-950 font-mono font-black text-xl flex items-center justify-center shadow-md shadow-amber-500/20"
                >
                  {d}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">Sin números atrasados extremos</span>
            )}
          </div>
        </div>

        {/* Números Fríos */}
        <div className="bg-slate-900/90 border border-sky-900/40 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Snowflake className="w-4 h-4" />
            <span>Números Fríos (Baja Actividad)</span>
          </div>
          <p className="text-xs text-slate-400">
            Dígitos con menor frecuencia en el historial evaluado:
          </p>
          <div className="flex items-center gap-2 pt-1">
            {coldDigits.length > 0 ? (
              coldDigits.map(d => (
                <span
                  key={d}
                  className="w-10 h-10 rounded-xl bg-gradient-to-t from-sky-700 to-sky-500 text-white font-mono font-black text-xl flex items-center justify-center shadow-md shadow-sky-500/20"
                >
                  {d}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">Sin números fríos</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Panel de Opciones y Nuevo Sorteo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {onNewDraw && (
          <button
            onClick={onNewDraw}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2 cursor-pointer w-fit"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Ingresar Otro Sorteo</span>
          </button>
        )}

        {/* Desplegable de Detalles Matemáticos Adicionales (Opcional) */}
        <button
          onClick={() => setShowExtraDetails(!showExtraDetails)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition ml-auto"
        >
          <span>{showExtraDetails ? 'Ocultar Desglose Estadístico' : 'Ver Desglose de Puntuación'}</span>
          {showExtraDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Detalle Estadístico Desplegable */}
      {showExtraDetails && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase">
            <Award className="w-4 h-4" />
            <span>Ponderación de Componentes del Modelo Matemático</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Transición Márkov</span>
              <span className="text-emerald-400 font-bold text-base">
                {bestCombo.componentScores.markov.toFixed(1)} / 100
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Modelo Cuántico</span>
              <span className="text-indigo-400 font-bold text-base">
                {bestCombo.componentScores.quantum.toFixed(1)} / 100
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Frecuencia Reciente</span>
              <span className="text-amber-400 font-bold text-base">
                {bestCombo.componentScores.recency.toFixed(1)} / 100
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Probabilidad Bayesiana</span>
              <span className="text-purple-400 font-bold text-base">
                {bestCombo.componentScores.bayesian.toFixed(1)} / 100
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Patrón de Suma</span>
              <span className="text-cyan-400 font-bold text-base">
                {bestCombo.componentScores.pattern.toFixed(1)} / 100
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

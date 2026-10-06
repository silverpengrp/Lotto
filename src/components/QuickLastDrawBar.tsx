import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Check, Zap, RotateCcw } from 'lucide-react';
import { Pick3Draw } from '../types/lottery';

interface QuickLastDrawBarProps {
  lastDraw?: Pick3Draw;
  onApplyLastDraw: (numberStr: string, saveToHistory: boolean) => void;
  isAnalyzing: boolean;
  onClear?: () => void;
}

export const QuickLastDrawBar: React.FC<QuickLastDrawBarProps> = ({
  lastDraw,
  onApplyLastDraw,
  isAnalyzing,
  onClear,
}) => {
  const getInitialVal = (rawVal?: number, normVal?: number) => {
    if (rawVal !== undefined) return rawVal.toString();
    if (normVal !== undefined) return normVal.toString();
    return '';
  };

  const [d1, setD1] = useState(lastDraw ? getInitialVal(lastDraw.rawD1, lastDraw.d1) : '');
  const [d2, setD2] = useState(lastDraw ? getInitialVal(lastDraw.rawD2, lastDraw.d2) : '');
  const [d3, setD3] = useState(lastDraw ? getInitialVal(lastDraw.rawD3, lastDraw.d3) : '');
  const [saveToHistory, setSaveToHistory] = useState(true);
  const [justCalculated, setJustCalculated] = useState(false);

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);

  // Sincronizar cuando cambia lastDraw
  useEffect(() => {
    if (lastDraw) {
      setD1(getInitialVal(lastDraw.rawD1, lastDraw.d1));
      setD2(getInitialVal(lastDraw.rawD2, lastDraw.d2));
      setD3(getInitialVal(lastDraw.rawD3, lastDraw.d3));
    }
  }, [lastDraw]);

  const handleDigitChange = (
    val: string,
    setVal: (v: string) => void,
    nextRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 2);
    setVal(clean);
    // Auto-avanzar si se ingresan 2 dígitos
    if (clean.length === 2 && nextRef?.current) {
      nextRef.current.focus();
      nextRef.current.select();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevRef?: React.RefObject<HTMLInputElement | null>,
    nextRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && prevRef?.current) {
      prevRef.current.focus();
    } else if (e.key === 'ArrowRight' && nextRef?.current) {
      nextRef.current.focus();
    } else if (e.key === 'ArrowLeft' && prevRef?.current) {
      prevRef.current.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Manejador de pegado rápido (ej. "12, 45, 13", "12-45-13", "12 45 13" o "742")
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').trim();
    const parts = text.split(/[\s,\-_;|]+/).filter(Boolean);
    if (parts.length >= 3) {
      setD1(parts[0].replace(/[^0-9]/g, '').slice(0, 2));
      setD2(parts[1].replace(/[^0-9]/g, '').slice(0, 2));
      setD3(parts[2].replace(/[^0-9]/g, '').slice(0, 2));
      input3Ref.current?.focus();
      return;
    }
    const clean = text.replace(/[^0-9]/g, '');
    if (clean.length === 6) {
      setD1(clean.slice(0, 2));
      setD2(clean.slice(2, 4));
      setD3(clean.slice(4, 6));
      input3Ref.current?.focus();
    } else if (clean.length >= 3) {
      setD1(clean[0]);
      setD2(clean[1]);
      setD3(clean[2]);
      input3Ref.current?.focus();
    }
  };

  const handleSubmit = () => {
    if (!d1 || !d2 || !d3) {
      if (!d1) input1Ref.current?.focus();
      else if (!d2) input2Ref.current?.focus();
      else if (!d3) input3Ref.current?.focus();
      return;
    }
    const isTwoDigit = parseInt(d1, 10) >= 10 || parseInt(d2, 10) >= 10 || parseInt(d3, 10) >= 10;
    const formatted = isTwoDigit ? `${d1}-${d2}-${d3}` : `${d1}${d2}${d3}`;
    onApplyLastDraw(formatted, saveToHistory);
    setJustCalculated(true);
    setTimeout(() => setJustCalculated(false), 2000);
  };

  const handleReset = () => {
    setD1('');
    setD2('');
    setD3('');
    input1Ref.current?.focus();
    if (onClear) onClear();
  };

  const isComplete = d1 !== '' && d2 !== '' && d3 !== '';

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 relative overflow-hidden backdrop-blur">
      {/* Resplandor de fondo */}
      <div className="absolute top-0 right-1/4 w-96 h-28 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
        {/* Encabezado de la sección de entrada */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>INGRESO DE RESULTADOS DEL ÚLTIMO SORTEO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Ingresa los Números del Último Sorteo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Escribe 1 o 2 dígitos en cada una de las 3 casillas (por ejemplo:{' '}
            <strong className="text-amber-300 font-mono">12, 45, 13</strong> o{' '}
            <strong className="text-slate-300 font-mono">7, 4, 2</strong>) para calcular el pronóstico ganador del próximo sorteo.
          </p>
        </div>

        {/* 3 Casillas de Entrada de Números (Acepta 1 o 2 dígitos cada una) */}
        <div
          className="flex items-center justify-center gap-3 sm:gap-5 py-2"
          onPaste={handlePaste}
        >
          {/* Casilla 1 */}
          <div className="flex flex-col items-center">
            <input
              ref={input1Ref}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={d1}
              onChange={e => handleDigitChange(e.target.value, setD1, input2Ref)}
              onKeyDown={e => handleKeyDown(e, undefined, input2Ref)}
              placeholder="12"
              className="w-20 h-20 sm:w-24 sm:h-24 text-center font-mono text-3xl sm:text-4xl font-black bg-slate-950 border-2 border-slate-700 focus:border-amber-400 text-amber-300 rounded-2xl shadow-inner focus:outline-none transition selection:bg-amber-500/40"
            />
            <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold uppercase tracking-wider">
              Casilla 1
            </span>
          </div>

          <span className="text-slate-600 font-mono text-2xl font-bold mb-6">-</span>

          {/* Casilla 2 */}
          <div className="flex flex-col items-center">
            <input
              ref={input2Ref}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={d2}
              onChange={e => handleDigitChange(e.target.value, setD2, input3Ref)}
              onKeyDown={e => handleKeyDown(e, input1Ref, input3Ref)}
              placeholder="45"
              className="w-20 h-20 sm:w-24 sm:h-24 text-center font-mono text-3xl sm:text-4xl font-black bg-slate-950 border-2 border-slate-700 focus:border-amber-400 text-emerald-300 rounded-2xl shadow-inner focus:outline-none transition selection:bg-emerald-500/40"
            />
            <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold uppercase tracking-wider">
              Casilla 2
            </span>
          </div>

          <span className="text-slate-600 font-mono text-2xl font-bold mb-6">-</span>

          {/* Casilla 3 */}
          <div className="flex flex-col items-center">
            <input
              ref={input3Ref}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={d3}
              onChange={e => handleDigitChange(e.target.value, setD3)}
              onKeyDown={e => handleKeyDown(e, input2Ref, undefined)}
              placeholder="13"
              className="w-20 h-20 sm:w-24 sm:h-24 text-center font-mono text-3xl sm:text-4xl font-black bg-slate-950 border-2 border-slate-700 focus:border-amber-400 text-sky-300 rounded-2xl shadow-inner focus:outline-none transition selection:bg-sky-500/40"
            />
            <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold uppercase tracking-wider">
              Casilla 3
            </span>
          </div>
        </div>

        {/* Botón de Acción Principal y Opciones */}
        <div className="flex flex-col items-center gap-3 w-full max-w-md">
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing || !isComplete}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base tracking-wide uppercase transition flex items-center justify-center gap-2.5 shadow-xl active:scale-95 ${
              isComplete
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400/50 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {justCalculated ? (
              <>
                <Check className="w-5 h-5 text-slate-950" />
                <span>¡PREDICCIÓN LISTA!</span>
              </>
            ) : isAnalyzing ? (
              <>
                <Zap className="w-5 h-5 animate-spin" />
                <span>CALCULANDO PRONÓSTICO MATEMÁTICO...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>OBTENER RESULTADOS DEL PRÓXIMO SORTEO</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between w-full px-2 text-xs text-slate-400">
            {/* Casilla de verificación para guardar en historial */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveToHistory}
                onChange={e => setSaveToHistory(e.target.checked)}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">Guardar en el historial de sorteos</span>
            </label>

            {/* Botón para limpiar */}
            {(d1 || d2 || d3) && (
              <button
                onClick={handleReset}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

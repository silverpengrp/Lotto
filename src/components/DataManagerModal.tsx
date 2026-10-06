import React, { useState } from 'react';
import { Pick3Draw } from '../types/lottery';
import { createDraw, parseUserDraws, PRELOADED_DATASETS } from '../data/sampleDatasets';
import {
  X,
  Upload,
  Plus,
  Trash2,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  Database,
} from 'lucide-react';

interface DataManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  draws: Pick3Draw[];
  onUpdateDraws: (updated: Pick3Draw[]) => void;
  selectedPreset: string;
  onSelectPreset: (key: string) => void;
}

export const DataManagerModal: React.FC<DataManagerModalProps> = ({
  isOpen,
  onClose,
  draws,
  onUpdateDraws,
  selectedPreset,
  onSelectPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'add' | 'history'>('paste');
  const [pasteText, setPasteText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Single draw form states
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [manualType, setManualType] = useState<Pick3Draw['drawType']>('Evening');
  const [manualDigits, setManualDigits] = useState('');

  if (!isOpen) return null;

  const handlePasteImport = () => {
    if (!pasteText.trim()) return;
    const parsed = parseUserDraws(pasteText);
    if (parsed.length > 0) {
      onUpdateDraws(parsed);
      setImportStatus(`Successfully parsed and loaded ${parsed.length} historical drawings!`);
      setPasteText('');
    } else {
      setImportStatus('Could not identify valid 3-digit lottery numbers from the provided input.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseUserDraws(content);
        if (parsed.length > 0) {
          onUpdateDraws(parsed);
          setImportStatus(`Successfully loaded ${parsed.length} drawings from ${file.name}`);
        } else {
          setImportStatus(`No valid 3-digit draws found in ${file.name}`);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = manualDigits.trim().split(/[\s,\-_;|]+/).filter(Boolean);
    let drawInput = manualDigits;
    if (parts.length >= 3) {
      drawInput = `${parts[0]}-${parts[1]}-${parts[2]}`;
    } else {
      const clean = manualDigits.replace(/[^0-9]/g, '');
      if (clean.length === 6) {
        drawInput = `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 6)}`;
      } else if (clean.length === 3) {
        drawInput = clean;
      } else {
        setImportStatus('Please enter 3 numbers (e.g. 12, 45, 13 or 742)');
        return;
      }
    }

    const newDraw = createDraw(
      `manual-${Date.now()}`,
      manualDate,
      manualType,
      drawInput,
      draws.length + 1
    );

    const updated = [...draws, newDraw];
    onUpdateDraws(updated);
    setManualDigits('');
    setImportStatus(`Added drawing ${drawInput} for ${manualDate} (${manualType}). Model updated.`);
  };

  const handleDeleteDraw = (id: string) => {
    const updated = draws.filter(d => d.id !== id);
    onUpdateDraws(updated);
  };

  const handleExportCSV = () => {
    const header = 'Date,DrawType,Result,D1,D2,D3,Sum,Type\n';
    const rows = draws
      .map(
        d =>
          `${d.date},${d.drawType},"${d.numberStr}",${d.d1},${d.d2},${d.d3},${d.sum},${d.type}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pick3-dataset-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span>Historical Pick 3 Dataset Manager</span>
            </h3>
            <p className="text-xs text-slate-400">
              Loaded: <strong>{draws.length}</strong> drawings in active dataset
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3 border-b border-slate-800 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'paste'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Bulk Paste / Upload CSV
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'add'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Add Single Draw
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Manage Drawing History ({draws.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {importStatus && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 flex items-center justify-between">
              <span>{importStatus}</span>
              <button
                onClick={() => setImportStatus(null)}
                className="text-slate-500 hover:text-slate-300"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Paste Historical Drawings (supports lines like <code>123</code>, <code>123, 456, 789</code>, or CSV formats)
                </label>
                <textarea
                  value={pasteText}
                  onChange={e => setPasteText(e.target.value)}
                  placeholder={`Example formats:\n742\n108\n953\n2026-10-01, Evening, 614\n2026-10-02, Midday, 820`}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handlePasteImport}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition"
                >
                  Import Pasted Drawings
                </button>

                {/* File Upload input */}
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Upload .CSV / .TXT File</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* State presets quick reload */}
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 block mb-2 font-mono">
                  Or load official historical state lottery presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PRELOADED_DATASETS).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onSelectPreset(key);
                        setImportStatus(`Loaded ${data.state} dataset with ${data.draws.length} draws.`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                        selectedPreset === key
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {data.state} ({data.draws.length})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleAddManual} className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Drawing Result (1 or 2 Digits per Space, e.g. 12, 45, 13 or 742)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  required
                  placeholder="e.g. 12, 45, 13 or 742"
                  value={manualDigits}
                  onChange={e => setManualDigits(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-base font-black text-amber-300 tracking-wider focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Drawing Date
                  </label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={e => setManualDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Draw Type
                  </label>
                  <select
                    value={manualType}
                    onChange={e => setManualType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Evening">Evening</option>
                    <option value="Midday">Midday</option>
                    <option value="Morning">Morning</option>
                    <option value="Night">Night</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition"
              >
                Add Drawing &amp; Recalculate Model
              </button>
            </form>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Showing all {draws.length} chronological draws</span>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/80">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Result</th>
                      <th className="py-2 px-3">Sum</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {draws.slice().reverse().map((d, idx) => (
                      <tr key={d.id} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 text-slate-500">{draws.length - idx}</td>
                        <td className="py-2 px-3 text-slate-300">{d.date}</td>
                        <td className="py-2 px-3 text-slate-400">{d.drawType}</td>
                        <td className="py-2 px-3 font-bold text-amber-300 text-sm">
                          {d.numberStr}
                        </td>
                        <td className="py-2 px-3 text-slate-400">{d.sum}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => handleDeleteDraw(d.id)}
                            className="p-1 rounded text-rose-400 hover:bg-rose-950/40"
                            title="Delete draw"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Close &amp; Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

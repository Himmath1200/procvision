import React, { useState } from 'react';
import { Plus, RotateCcw, Play, Sparkles, AlertCircle, FileText, Dice5 } from 'lucide-react';
import { SAMPLE_DATASETS } from '../utils/presets.js';

export default function ProcessInput({
  processes,
  onAddProcess,
  onReset,
  onRunSimulation,
  onLoadPreset,
  isRunning = false,
}) {
  const [processId, setProcessId] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [burstTime, setBurstTime] = useState('');
  const [error, setError] = useState('');

  // Auto-fill next sequential ID (e.g., P1, P2, P3...)
  const nextSuggestedId = `P${processes.length + 1}`;
  const effectiveId = processId.trim() || nextSuggestedId;

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');

    const trimmedId = effectiveId;
    const at = Number(arrivalTime);
    const bt = Number(burstTime);

    if (arrivalTime === '' || isNaN(at) || at < 0) {
      setError('Arrival time must be a non-negative integer/number (>= 0).');
      return;
    }

    if (burstTime === '' || isNaN(bt) || bt <= 0) {
      setError('Burst time must be a positive number greater than 0.');
      return;
    }

    // Check duplicate ID
    if (processes.some((p) => p.id.toLowerCase() === trimmedId.toLowerCase())) {
      setError(`Process ID "${trimmedId}" already exists. Please choose a unique ID.`);
      return;
    }

    onAddProcess({
      id: trimmedId,
      arrivalTime: at,
      burstTime: bt,
    });

    // Reset inputs for next entry
    setProcessId('');
    setArrivalTime('');
    setBurstTime('');
  };

  const handleRandomGenerate = () => {
    const randomCount = 4;
    const newProcs = Array.from({ length: randomCount }, (_, i) => ({
      id: `P${i + 1}`,
      arrivalTime: Math.floor(Math.random() * 6),
      burstTime: Math.floor(Math.random() * 8) + 1,
    }));
    // Sort slightly by arrival time for visual realism
    newProcs.sort((a, b) => a.arrivalTime - b.arrivalTime);
    onLoadPreset(newProcs);
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header and Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>Process Configuration</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
              {processes.length} {processes.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define process arrival and execution burst times or load a preset scenario.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative inline-block text-left">
            <select
              aria-label="Load preset sample dataset"
              onChange={(e) => {
                const key = e.target.value;
                if (key && SAMPLE_DATASETS[key]) {
                  onLoadPreset(SAMPLE_DATASETS[key].processes);
                  setError('');
                }
              }}
              defaultValue=""
              className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="" disabled>
                Select Sample Preset...
              </option>
              {Object.entries(SAMPLE_DATASETS).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.name} ({data.processes.length} procs)
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleRandomGenerate}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Generate random sample processes"
          >
            <Dice5 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Randomize</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          
          {/* Process ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Process ID
            </label>
            <input
              type="text"
              value={processId}
              onChange={(e) => setProcessId(e.target.value)}
              placeholder={nextSuggestedId}
              className="w-full text-sm font-mono px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Arrival Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Arrival Time (AT)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              placeholder="e.g. 0"
              className="w-full text-sm font-mono px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Burst Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Burst Time (BT)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                step="any"
                value={burstTime}
                onChange={(e) => setBurstTime(e.target.value)}
                placeholder="e.g. 6"
                className="w-full text-sm font-mono px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center justify-center p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs shadow-blue-500/20 transition-colors"
                title="Add process"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setError('');
              onReset();
            }}
            disabled={processes.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear / Reset</span>
          </button>

          <button
            type="button"
            onClick={onRunSimulation}
            disabled={processes.length === 0 || isRunning}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute Simulation</span>
          </button>
        </div>

      </form>
    </div>
  );
}

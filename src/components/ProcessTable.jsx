import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Inbox, Download } from 'lucide-react';
import { getProcessColor } from '../utils/colors.js';
import { exportToCSV } from '../utils/exportCSV.js';

export default function ProcessTable({
  processes,
  simulationResult,
  algorithmName = 'Simulation',
  onDeleteProcess,
  onUpdateProcess,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editAt, setEditAt] = useState('');
  const [editBt, setEditBt] = useState('');

  const hasResult = Boolean(simulationResult && simulationResult.processes?.length > 0);
  const displayList = hasResult ? simulationResult.processes : processes;

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditAt(p.arrivalTime);
    setEditBt(p.burstTime);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    const at = Number(editAt);
    const bt = Number(editBt);
    if (!isNaN(at) && at >= 0 && !isNaN(bt) && bt > 0) {
      onUpdateProcess(id, { arrivalTime: at, burstTime: bt });
    }
    setEditingId(null);
  };

  const handleExport = () => {
    if (!hasResult) return;
    exportToCSV(algorithmName, simulationResult.processes, simulationResult.metrics);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* Table Header toolbar */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>Process Metrics & Execution Details</span>
            {hasResult && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Calculated
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {hasResult
              ? 'Results computed with exact scheduling logic formulas.'
              : 'Add processes above or load a sample scenario to begin.'}
          </p>
        </div>

        {hasResult && (
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* Table Content */}
      {displayList.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-700">No processes defined</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
            Add your first process above or select a preset dataset to run the simulation.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Process</th>
                <th className="py-3 px-4">Arrival Time (AT)</th>
                <th className="py-3 px-4">Burst Time (BT)</th>
                {hasResult && (
                  <>
                    <th className="py-3 px-4">Completion (CT)</th>
                    <th className="py-3 px-4">Turnaround (TAT)</th>
                    <th className="py-3 px-4">Waiting (WT)</th>
                    <th className="py-3 px-4">Response (RT)</th>
                  </>
                )}
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {displayList.map((p, idx) => {
                const isEditing = editingId === p.id;
                const colors = getProcessColor(p.id, idx);

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Process ID */}
                    <td className="py-3 px-4 font-sans font-medium">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${colors.bg}`}
                          aria-hidden="true"
                        />
                        <span className="font-semibold text-slate-800">{p.id}</span>
                      </div>
                    </td>

                    {/* Arrival Time */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={editAt}
                          onChange={(e) => setEditAt(e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{p.arrivalTime}</span>
                      )}
                    </td>

                    {/* Burst Time */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          step="any"
                          value={editBt}
                          onChange={(e) => setEditBt(e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{p.burstTime}</span>
                      )}
                    </td>

                    {/* Results if computed */}
                    {hasResult && (
                      <>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {p.completionTime}
                        </td>
                        <td className="py-3 px-4 text-blue-600 font-semibold">
                          {p.turnaroundTime}
                        </td>
                        <td className="py-3 px-4 text-purple-600 font-semibold">
                          {p.waitingTime}
                        </td>
                        <td className="py-3 px-4 text-emerald-600 font-semibold">
                          {p.responseTime}
                        </td>
                      </>
                    )}

                    {/* Actions */}
                    <td className="py-3 px-4 text-right font-sans">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => saveEdit(p.id)}
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Save changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="p-1 rounded text-slate-400 hover:bg-slate-100 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Edit Arrival / Burst Time"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProcess(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Process"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

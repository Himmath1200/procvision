import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Zap, Download, RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import ProcessInput from '../components/ProcessInput.jsx';
import GanttChart from '../components/GanttChart.jsx';
import ComparisonChart from '../components/ComparisonChart.jsx';
import AlgorithmInfo from '../components/AlgorithmInfo.jsx';
import { runSJF } from '../algorithms/sjf.js';
import { runSRTF } from '../algorithms/srtf.js';
import { SAMPLE_DATASETS } from '../utils/presets.js';
import { exportToCSV } from '../utils/exportCSV.js';
import { saveSimulationHistory } from '../utils/storage.js';

export default function Comparison() {
  const [processes, setProcesses] = useState(SAMPLE_DATASETS.classic.processes);
  const [sjfResult, setSjfResult] = useState(null);
  const [srtfResult, setSrtfResult] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    executeComparison(SAMPLE_DATASETS.classic.processes);
  }, []);

  const executeComparison = (procs = processes) => {
    if (!procs || procs.length === 0) return;

    const sjf = runSJF(procs);
    const srtf = runSRTF(procs);

    setSjfResult(sjf);
    setSrtfResult(srtf);
    setHasRun(true);

    saveSimulationHistory({
      algorithm: 'Comparison',
      processes: procs,
      metrics: srtf.metrics,
    });
  };

  const handleAddProcess = (newProc) => {
    const updated = [...processes, newProc];
    setProcesses(updated);
    if (hasRun) executeComparison(updated);
  };

  const handleReset = () => {
    setProcesses([]);
    setSjfResult(null);
    setSrtfResult(null);
    setHasRun(false);
  };

  const handleLoadPreset = (presetProcesses) => {
    setProcesses(presetProcesses);
    executeComparison(presetProcesses);
  };

  const handleExportComparison = () => {
    if (!sjfResult || !srtfResult) return;
    // Export combined report
    exportToCSV('SJF_Benchmark', sjfResult.processes, sjfResult.metrics);
    exportToCSV('SRTF_Benchmark', srtfResult.processes, srtfResult.metrics);
  };

  const sjfMetrics = sjfResult?.metrics;
  const srtfMetrics = srtfResult?.metrics;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Comparative Performance Analysis: SJF vs. SRTF
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Simultaneously execute Non-Preemptive SJF and Preemptive SRTF across identical process workloads to compare waiting times, turnaround, CPU efficiency, and context-switching trade-offs.
          </p>
        </div>

        {hasRun && (
          <button
            type="button"
            onClick={handleExportComparison}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-2xs self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Comparison CSVs</span>
          </button>
        )}
      </div>

      {/* Shared Workload Configuration */}
      <ProcessInput
        processes={processes}
        onAddProcess={handleAddProcess}
        onReset={handleReset}
        onRunSimulation={() => executeComparison(processes)}
        onLoadPreset={handleLoadPreset}
      />

      {hasRun && sjfMetrics && srtfMetrics && (
        <>
          {/* Detailed Metric Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">
                Performance Metrics Comparison Table
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Head-to-head comparison computed across the exact same process inputs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Performance Metric</th>
                    <th className="py-3 px-4 text-blue-700">SJF (Non-Preemptive)</th>
                    <th className="py-3 px-4 text-purple-700">SRTF (Preemptive)</th>
                    <th className="py-3 px-4">Difference / Δ</th>
                    <th className="py-3 px-4 text-right">Better Algorithm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  {/* Avg Waiting Time */}
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                      Average Waiting Time (WT)
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-bold">{sjfMetrics.avgWaitingTime} u</td>
                    <td className="py-3 px-4 text-purple-600 font-bold">{srtfMetrics.avgWaitingTime} u</td>
                    <td className="py-3 px-4">
                      {Math.abs(sjfMetrics.avgWaitingTime - srtfMetrics.avgWaitingTime).toFixed(2)} u
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      {sjfMetrics.avgWaitingTime === srtfMetrics.avgWaitingTime ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                          Equal
                        </span>
                      ) : sjfMetrics.avgWaitingTime < srtfMetrics.avgWaitingTime ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                          SJF Better
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                          SRTF Better
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Avg Turnaround Time */}
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                      Average Turnaround Time (TAT)
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-bold">{sjfMetrics.avgTurnaroundTime} u</td>
                    <td className="py-3 px-4 text-purple-600 font-bold">{srtfMetrics.avgTurnaroundTime} u</td>
                    <td className="py-3 px-4">
                      {Math.abs(sjfMetrics.avgTurnaroundTime - srtfMetrics.avgTurnaroundTime).toFixed(2)} u
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      {sjfMetrics.avgTurnaroundTime === srtfMetrics.avgTurnaroundTime ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                          Equal
                        </span>
                      ) : sjfMetrics.avgTurnaroundTime < srtfMetrics.avgTurnaroundTime ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                          SJF Better
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                          SRTF Better
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Avg Response Time */}
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                      Average Response Time (RT)
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-bold">{sjfMetrics.avgResponseTime} u</td>
                    <td className="py-3 px-4 text-purple-600 font-bold">{srtfMetrics.avgResponseTime} u</td>
                    <td className="py-3 px-4">
                      {Math.abs(sjfMetrics.avgResponseTime - srtfMetrics.avgResponseTime).toFixed(2)} u
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      {sjfMetrics.avgResponseTime === srtfMetrics.avgResponseTime ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                          Equal
                        </span>
                      ) : sjfMetrics.avgResponseTime < srtfMetrics.avgResponseTime ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                          SJF Better
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                          SRTF Better
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* CPU Utilization */}
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                      CPU Utilization (%)
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-bold">{sjfMetrics.cpuUtilization}%</td>
                    <td className="py-3 px-4 text-purple-600 font-bold">{srtfMetrics.cpuUtilization}%</td>
                    <td className="py-3 px-4">
                      {Math.abs(sjfMetrics.cpuUtilization - srtfMetrics.cpuUtilization).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      {sjfMetrics.cpuUtilization === srtfMetrics.cpuUtilization ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                          Equal ({sjfMetrics.cpuUtilization}%)
                        </span>
                      ) : sjfMetrics.cpuUtilization > srtfMetrics.cpuUtilization ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                          SJF Better
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                          SRTF Better
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Throughput */}
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                      System Throughput
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-bold">{sjfMetrics.throughput} proc/u</td>
                    <td className="py-3 px-4 text-purple-600 font-bold">{srtfMetrics.throughput} proc/u</td>
                    <td className="py-3 px-4">
                      {Math.abs(sjfMetrics.throughput - srtfMetrics.throughput).toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      {sjfMetrics.throughput === srtfMetrics.throughput ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                          Equal
                        </span>
                      ) : sjfMetrics.throughput > srtfMetrics.throughput ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                          SJF Better
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                          SRTF Better
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Recharts Graphs */}
          <ComparisonChart sjfResult={sjfResult} srtfResult={srtfResult} />

          {/* Side-by-Side Dual Gantt Charts */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Comparative Gantt Chart Timelines
            </h3>
            <div className="space-y-4">
              <GanttChart
                timeline={sjfResult.timeline}
                title="SJF Timeline (Non-Preemptive)"
              />
              <GanttChart
                timeline={srtfResult.timeline}
                preemptions={srtfResult.preemptions}
                title="SRTF Timeline (Preemptive Execution with Context Switches)"
              />
            </div>
          </div>
        </>
      )}

      {/* Algorithm theory */}
      <AlgorithmInfo defaultTab="compare" />

    </div>
  );
}

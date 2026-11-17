import React, { useState, useEffect } from 'react';
import { Clock, Cpu, BarChart2, CheckCircle2, Zap } from 'lucide-react';
import ProcessInput from '../components/ProcessInput.jsx';
import ProcessTable from '../components/ProcessTable.jsx';
import GanttChart from '../components/GanttChart.jsx';
import MetricCard from '../components/MetricCard.jsx';
import AlgorithmInfo from '../components/AlgorithmInfo.jsx';
import { runSJF } from '../algorithms/sjf.js';
import { SAMPLE_DATASETS } from '../utils/presets.js';
import { saveSimulationHistory } from '../utils/storage.js';

export default function SJF() {
  // Initialize with classic textbook preset so users have immediate interactivity
  const [processes, setProcesses] = useState(SAMPLE_DATASETS.classic.processes);
  const [simulationResult, setSimulationResult] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  // Auto-run initial simulation on mount with default dataset
  useEffect(() => {
    executeSimulation(SAMPLE_DATASETS.classic.processes);
  }, []);

  const executeSimulation = (procs = processes) => {
    if (!procs || procs.length === 0) return;
    const result = runSJF(procs);
    setSimulationResult(result);
    setHasRun(true);

    // Save to history
    saveSimulationHistory({
      algorithm: 'SJF',
      processes: procs,
      metrics: result.metrics,
    });
  };

  const handleAddProcess = (newProc) => {
    const updated = [...processes, newProc];
    setProcesses(updated);
    // Keep simulation in sync if already ran
    if (hasRun) {
      executeSimulation(updated);
    }
  };

  const handleUpdateProcess = (id, updatedFields) => {
    const updated = processes.map((p) =>
      p.id === id ? { ...p, ...updatedFields } : p
    );
    setProcesses(updated);
    if (hasRun) {
      executeSimulation(updated);
    }
  };

  const handleDeleteProcess = (id) => {
    const updated = processes.filter((p) => p.id !== id);
    setProcesses(updated);
    if (updated.length === 0) {
      setSimulationResult(null);
      setHasRun(false);
    } else if (hasRun) {
      executeSimulation(updated);
    }
  };

  const handleReset = () => {
    setProcesses([]);
    setSimulationResult(null);
    setHasRun(false);
  };

  const handleLoadPreset = (presetProcesses) => {
    setProcesses(presetProcesses);
    executeSimulation(presetProcesses);
  };

  const metrics = simulationResult?.metrics;

  return (
    <div className="space-y-7 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Module 1: Non-Preemptive Shortest Job First (SJF)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            SJF selects the process with the shortest CPU burst among all currently arrived processes. Once assigned, the CPU executes the chosen process until termination without interruption.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Non-Preemptive Execution
          </span>
        </div>
      </div>

      {/* Process Input and Configuration Card */}
      <ProcessInput
        processes={processes}
        onAddProcess={handleAddProcess}
        onReset={handleReset}
        onRunSimulation={() => executeSimulation(processes)}
        onLoadPreset={handleLoadPreset}
      />

      {/* Performance Summary Metrics */}
      {hasRun && metrics && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800">
            SJF Performance Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <MetricCard
              title="Avg Waiting Time"
              value={metrics.avgWaitingTime}
              unit="units"
              icon={Clock}
              accent="purple"
              description="Sum(WT) / N"
            />
            <MetricCard
              title="Avg Turnaround Time"
              value={metrics.avgTurnaroundTime}
              unit="units"
              icon={BarChart2}
              accent="blue"
              description="Sum(TAT) / N"
            />
            <MetricCard
              title="Avg Response Time"
              value={metrics.avgResponseTime}
              unit="units"
              icon={Zap}
              accent="emerald"
              description="Equal to WT (Non-preemptive)"
            />
            <MetricCard
              title="CPU Utilization"
              value={`${metrics.cpuUtilization}%`}
              icon={Cpu}
              accent="indigo"
              description="Busy / Total simulation"
            />
            <MetricCard
              title="Throughput"
              value={metrics.throughput}
              unit="jobs/unit"
              icon={CheckCircle2}
              accent="amber"
              description="Completed / Total time"
            />
          </div>
        </div>
      )}

      {/* Gantt Chart Visualization */}
      {hasRun && simulationResult && (
        <GanttChart
          timeline={simulationResult.timeline}
          title="SJF Process Execution Timeline (Gantt Chart)"
        />
      )}

      {/* Execution Sequence Summary */}
      {hasRun && simulationResult?.executionSequence && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Non-Preemptive Execution Order
          </h3>
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            {simulationResult.executionSequence.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-semibold flex items-center gap-1.5">
                  <span>{item.processId}</span>
                  <span className="text-[10px] text-blue-500 font-normal">
                    [{item.startTime} → {item.endTime}]
                  </span>
                </div>
                {idx < simulationResult.executionSequence.length - 1 && (
                  <span className="text-slate-300 font-sans">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Process Table with Results & In-line Edit */}
      <ProcessTable
        processes={processes}
        simulationResult={simulationResult}
        algorithmName="SJF_NonPreemptive"
        onDeleteProcess={handleDeleteProcess}
        onUpdateProcess={handleUpdateProcess}
      />

      {/* Theory & Formula explanation */}
      <AlgorithmInfo defaultTab="sjf" />

    </div>
  );
}

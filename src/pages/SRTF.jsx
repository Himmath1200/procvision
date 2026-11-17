import React, { useState, useEffect } from 'react';
import { Zap, Clock, Cpu, BarChart2, CheckCircle2, ShieldAlert } from 'lucide-react';
import ProcessInput from '../components/ProcessInput.jsx';
import ProcessTable from '../components/ProcessTable.jsx';
import GanttChart from '../components/GanttChart.jsx';
import MetricCard from '../components/MetricCard.jsx';
import AlgorithmInfo from '../components/AlgorithmInfo.jsx';
import { runSRTF } from '../algorithms/srtf.js';
import { SAMPLE_DATASETS } from '../utils/presets.js';
import { saveSimulationHistory } from '../utils/storage.js';

export default function SRTF() {
  // Initialize with classic textbook preset
  const [processes, setProcesses] = useState(SAMPLE_DATASETS.classic.processes);
  const [simulationResult, setSimulationResult] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    executeSimulation(SAMPLE_DATASETS.classic.processes);
  }, []);

  const executeSimulation = (procs = processes) => {
    if (!procs || procs.length === 0) return;
    const result = runSRTF(procs);
    setSimulationResult(result);
    setHasRun(true);

    saveSimulationHistory({
      algorithm: 'SRTF',
      processes: procs,
      metrics: result.metrics,
    });
  };

  const handleAddProcess = (newProc) => {
    const updated = [...processes, newProc];
    setProcesses(updated);
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
  const preemptions = simulationResult?.preemptions || [];

  return (
    <div className="space-y-7 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Module 2: Preemptive Shortest Remaining Time First (SRTF)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            SRTF schedules the process with the smallest remaining burst time. The currently running job is immediately preempted whenever an arriving job has a strictly shorter remaining execution time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Preemptive Scheduling Active
          </span>
        </div>
      </div>

      {/* Input configuration */}
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
            SRTF Performance Metrics
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
              description="First Run - Arrival"
            />
            <MetricCard
              title="CPU Utilization"
              value={`${metrics.cpuUtilization}%`}
              icon={Cpu}
              accent="indigo"
              description="Busy / Total simulation"
            />
            <MetricCard
              title="Preemption Events"
              value={preemptions.length}
              unit="Switches"
              icon={ShieldAlert}
              accent="amber"
              description="Context preemption points"
            />
          </div>
        </div>
      )}

      {/* Gantt Chart with Preemption Highlights */}
      {hasRun && simulationResult && (
        <GanttChart
          timeline={simulationResult.timeline}
          preemptions={simulationResult.preemptions}
          title="SRTF Preemptive Execution Timeline (Gantt Chart)"
        />
      )}

      {/* Execution Sequence Summary */}
      {hasRun && simulationResult?.executionSequence && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Preemptive Execution Intervals
          </h3>
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            {simulationResult.executionSequence.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 font-semibold flex items-center gap-1.5">
                  <span>{item.processId}</span>
                  <span className="text-[10px] text-purple-500 font-normal">
                    [{item.startTime} → {item.endTime}] ({item.duration}u)
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
        algorithmName="SRTF_Preemptive"
        onDeleteProcess={handleDeleteProcess}
        onUpdateProcess={handleUpdateProcess}
      />

      {/* Theory & Formula explanation */}
      <AlgorithmInfo defaultTab="srtf" />

    </div>
  );
}

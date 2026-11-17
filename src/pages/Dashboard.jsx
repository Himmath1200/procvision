import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Clock,
  Zap,
  BarChart2,
  Activity,
  ArrowRight,
  RotateCcw,
  History,
  Layers,
  Sparkles,
  CheckCircle2,
  Box,
} from 'lucide-react';
import MetricCard from '../components/MetricCard.jsx';
import {
  getSimulationHistory,
  getTotalProcessesSimulated,
  getTotalSimulationsCount,
  clearSimulationHistory,
} from '../utils/storage.js';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [totalProcesses, setTotalProcesses] = useState(0);
  const [totalSimulations, setTotalSimulations] = useState(0);

  useEffect(() => {
    setHistory(getSimulationHistory());
    setTotalProcesses(getTotalProcessesSimulated());
    setTotalSimulations(getTotalSimulationsCount());
  }, []);

  const handleClearHistory = () => {
    clearSimulationHistory();
    setHistory([]);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 3D Glassmorphism Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-10 text-white shadow-xl shadow-indigo-500/10 border border-white/10 perspective-1000">
        
        {/* Animated Background Mesh & Glows */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute right-36 bottom-0 translate-y-12 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Left Text and CTA */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Interactive 3D CPU Scheduling Simulator</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
              ProcVision Engine
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
              Simulate, visualize, and benchmark <strong>Non-Preemptive Shortest Job First (SJF)</strong> and <strong>Preemptive Shortest Remaining Time First (SRTF)</strong> with dynamic Gantt charts, step-by-step 3D playback, and verified OS metrics.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/sjf"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 text-xs font-bold shadow-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
              >
                <span>Launch SJF Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/srtf"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white border border-purple-400/40 text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span>Launch SRTF Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/comparison"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Compare Both</span>
              </Link>
            </div>
          </div>

          {/* Right 3D Isometric Floating Processor Visual */}
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <div className="relative w-48 h-48 animate-float-slow">
              {/* 3D Layer 1 - Shadow Base */}
              <div className="absolute inset-4 rounded-3xl bg-indigo-950/80 shadow-[0_25px_40px_rgba(0,0,0,0.5)] transform rotate-x-12 rotate-y-12 -rotate-z-6" />

              {/* 3D Layer 2 - Intermediate PCB */}
              <div className="absolute inset-2 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-800 border border-indigo-400/30 transform rotate-x-12 rotate-y-12 -rotate-z-6 flex items-center justify-center">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 border border-white/30 shadow-inner flex flex-col items-center justify-center text-white p-2 text-center">
                  <Cpu className="w-8 h-8 animate-pulse text-amber-300" />
                  <span className="text-[10px] font-mono font-bold mt-1 tracking-widest">
                    DUAL-CORE
                  </span>
                </div>
              </div>

              {/* Floating Pin Accents */}
              <div className="absolute -top-1 -right-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold shadow-md shadow-emerald-500/30 animate-pulse">
                ACTIVE
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Global Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Algorithms Available"
          value="2"
          unit="Modes"
          icon={Layers}
          accent="blue"
          description="SJF (Non-Preemptive) & SRTF"
        />
        <MetricCard
          title="Total Processes Simulated"
          value={totalProcesses}
          unit="Jobs"
          icon={Cpu}
          accent="purple"
          description="Tracked via local sessions"
        />
        <MetricCard
          title="Simulations Run"
          value={totalSimulations}
          unit="Executions"
          icon={Activity}
          accent="emerald"
          description="Total test runs completed"
        />
        <MetricCard
          title="Engine Status"
          value="Online"
          icon={CheckCircle2}
          accent="indigo"
          description="Zero-latency browser runtime"
          badgeText="Active"
          badgeType="success"
        />
      </div>

      {/* Quick Launch Cards with 3D hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SJF Module Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between group card-3d">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Non-Preemptive
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Module 1: SJF Simulator
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Shortest Job First executes the job with the lowest burst time without preemption until full termination. Ideal for batch processes with predictable bursts.
              </p>
            </div>

            <div className="text-xs font-mono bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-slate-600">
              <div>• Decision: <span className="text-slate-800 font-semibold">Min Burst Time at completion</span></div>
              <div>• Preemption: <span className="text-slate-800 font-semibold">Disabled (Runs to completion)</span></div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/sjf"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Open SJF Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* SRTF Module Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-purple-400 transition-all flex flex-col justify-between group card-3d">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/80 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Preemptive
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Module 2: SRTF Simulator
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Shortest Remaining Time First continually assesses arrived jobs and preempts the active CPU process immediately when a shorter job enters the ready queue.
              </p>
            </div>

            <div className="text-xs font-mono bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-slate-600">
              <div>• Decision: <span className="text-slate-800 font-semibold">Min Remaining Time at any arrival</span></div>
              <div>• Preemption: <span className="text-slate-800 font-semibold">Enabled (Immediate context switch)</span></div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/srtf"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Open SRTF Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Simulation History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden card-3d">
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Recent Simulation History
              </h3>
              <p className="text-xs text-slate-500">
                Locally saved simulation records from your recent browser runs.
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No simulations recorded yet. Run SJF or SRTF to populate recent history.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Algorithm</th>
                  <th className="py-3 px-4">Processes</th>
                  <th className="py-3 px-4">Avg Waiting Time</th>
                  <th className="py-3 px-4">Avg Turnaround</th>
                  <th className="py-3 px-4">CPU Util</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] border ${
                          item.algorithm === 'SJF'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {item.algorithm}
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.processCount} Jobs</td>
                    <td className="py-3 px-4">{item.metrics.avgWaitingTime} u</td>
                    <td className="py-3 px-4">{item.metrics.avgTurnaroundTime} u</td>
                    <td className="py-3 px-4">{item.metrics.cpuUtilization}%</td>
                    <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

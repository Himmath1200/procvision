import React from 'react';
import { BookOpen, Cpu, Layers, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AlgorithmInfo from '../components/AlgorithmInfo.jsx';

export default function Guide() {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <BookOpen className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Theory, Formulas & Academic Scheduling Principles
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Detailed documentation of CPU scheduling terminology, mathematical derivations, tie-breaking rules, and design considerations.
        </p>
      </div>

      {/* Main Algorithm Reference Component */}
      <AlgorithmInfo defaultTab="sjf" />

      {/* In-depth Academic Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SJF Details */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Non-Preemptive SJF Scheduling</span>
          </h3>

          <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
            <p>
              In <strong>Non-Preemptive Shortest Job First (SJF)</strong>, the CPU scheduler selects the process with the smallest execution burst time among all arrived processes present in the ready queue.
            </p>
            <p>
              Once a process is dispatched, it runs to termination without interruption. Even if a newly arrived process possesses a significantly smaller burst time, it must wait until the running process finishes.
            </p>
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-mono text-[11px] text-slate-700">
              <strong>Tie-breaking Criteria:</strong> If multiple processes share identical burst times, the process with the earlier Arrival Time (AT) is chosen. If arrival times are identical, original submission order is respected.
            </div>

            <div className="pt-2">
              <Link
                to="/sjf"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-xs"
              >
                <span>Try SJF Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* SRTF Details */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-purple-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <span>Preemptive SRTF Scheduling</span>
          </h3>

          <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
            <p>
              <strong>Shortest Remaining Time First (SRTF)</strong> is the preemptive counterpart of SJF. The scheduler dynamically re-evaluates the ready queue at each process arrival event.
            </p>
            <p>
              If an arriving process has a burst time strictly less than the currently running process’s remaining burst time, the active process is preempted (moved back to the ready queue) and the newly arrived process receives the CPU.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-mono text-[11px] text-slate-700">
              <strong>Starvation & Context Switching:</strong> While SRTF yields the minimal theoretical average waiting time, frequent preemptions introduce context switch overhead in real operating systems, and long jobs may face starvation.
            </div>

            <div className="pt-2">
              <Link
                to="/srtf"
                className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-semibold text-xs"
              >
                <span>Try SRTF Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

import React from 'react';
import { BookOpen, Check, AlertTriangle, ArrowRight, Activity, Zap, Clock } from 'lucide-react';

export default function AlgorithmInfo({ defaultTab = 'sjf' }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6">
      
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            CPU Scheduling Reference & Theoretical Foundation
          </h3>
          <p className="text-xs text-slate-500">
            Core mathematical formulas, dispatching criteria, and comparative trade-offs.
          </p>
        </div>
      </div>

      {/* Grid of Formulas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Turnaround Time (TAT)
          </div>
          <div className="mt-1 font-mono text-sm font-bold text-blue-700">
            CT - AT
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total duration from process submission (Arrival Time) to its full completion.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Waiting Time (WT)
          </div>
          <div className="mt-1 font-mono text-sm font-bold text-purple-700">
            TAT - BT
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total time a process spent waiting in the ready queue before finishing execution.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Response Time (RT)
          </div>
          <div className="mt-1 font-mono text-sm font-bold text-emerald-700">
            First Run - AT
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Time elapsed between process arrival and its very first CPU execution time unit.
          </p>
        </div>
      </div>

      {/* SJF vs SRTF Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* SJF Card */}
        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Non-Preemptive SJF
            </h4>
          </div>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Context Switching:</strong> Once a process secures the CPU, it runs uninterrupted until completion.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Response Time = Waiting Time:</strong> Because there is no preemption, the initial response occurs immediately when waiting ends.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Convoy Effect Risk:</strong> A long burst process arriving slightly earlier will delay subsequent very short jobs.
              </span>
            </li>
          </ul>
        </div>

        {/* SRTF Card */}
        <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/30 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Preemptive SRTF
            </h4>
          </div>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Theoretically Optimal Average WT:</strong> Provides the lowest theoretical average waiting time across all scheduling algorithms.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Immediate Preemption:</strong> Newly arrived shorter jobs interrupt the current running process immediately.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Context Switch Overhead & Starvation:</strong> Frequent preemptions consume CPU cycles; long jobs may starve if short jobs arrive continually.
              </span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}

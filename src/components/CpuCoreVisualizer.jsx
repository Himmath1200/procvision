import React from 'react';
import { Cpu, Zap, Activity, Radio, Gauge } from 'lucide-react';
import { getProcessColor } from '../utils/colors.js';

export default function CpuCoreVisualizer({
  currentSegment,
  currentTime,
  totalTime,
  isRunning = false,
}) {
  const activeProcId = currentSegment ? currentSegment.processId : 'IDLE';
  const isIdle = !currentSegment || currentSegment.isIdle;
  const colors = getProcessColor(activeProcId);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-2xl border border-indigo-500/20 perspective-1000">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Header telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-indigo-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-indigo-300">
              ProcVision Hardware Telemetry
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Silicon Core 0 • 3D Die Execution Engine
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
            <span>Clock: {currentTime}u / {totalTime}u</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-amber-400" />
            <span>Load: {isIdle ? '0%' : '100%'}</span>
          </div>
        </div>
      </div>

      {/* 3D Isometric Core Display */}
      <div className="relative z-10 py-8 flex flex-col md:flex-row items-center justify-around gap-8">
        
        {/* 3D Chip Platform */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          
          {/* Outer PCB Plate with 3D drop shadow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-slate-800 to-indigo-900 border-2 border-indigo-500/40 shadow-[0_20px_50px_rgba(30,27,75,0.8)] transform rotate-x-12 -rotate-y-12 rotate-z-2 transition-transform duration-500 hover:rotate-0">
            
            {/* Corner Gold Contact Pads */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-amber-400/80 shadow-xs shadow-amber-400" />
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-400/80 shadow-xs shadow-amber-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-amber-400/80 shadow-xs shadow-amber-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-amber-400/80 shadow-xs shadow-amber-400" />
            
            {/* Bus traces */}
            <div className="absolute inset-3 rounded-2xl border border-indigo-400/20 bg-grid-pattern opacity-60" />
          </div>

          {/* Central Die / Heat Spreader */}
          <div className="relative z-10 w-32 h-32 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-400/50 shadow-xl flex flex-col items-center justify-center p-3 text-center transition-all">
            
            {/* Active Core Glow Ring */}
            <div
              className={`absolute -inset-1 rounded-2xl opacity-75 blur-md transition-all duration-300 ${
                isIdle ? 'bg-slate-700/50' : 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse'
              }`}
            />

            <div className="relative z-10 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400">
                ACTIVE JOB
              </span>
              <div
                className={`text-2xl font-black font-mono tracking-wider ${
                  isIdle ? 'text-slate-500' : 'text-white drop-shadow-md'
                }`}
              >
                {activeProcId}
              </div>
              <div className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-slate-300 border border-white/10">
                {isIdle ? 'CPU IDLE' : 'EXECUTING'}
              </div>
            </div>
          </div>

        </div>

        {/* 4-Stage Micro-Architecture Pipeline */}
        <div className="w-full md:w-auto flex-1 max-w-md space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pipeline Dispatch Stages
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-indigo-500/20 flex items-center justify-between">
              <span className="text-slate-400">1. FETCH</span>
              <span className="text-emerald-400 font-bold">READY</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-indigo-500/20 flex items-center justify-between">
              <span className="text-slate-400">2. DECODE</span>
              <span className="text-blue-400 font-bold">SJF/SRTF</span>
            </div>
            <div
              className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                !isIdle
                  ? 'bg-indigo-900/60 border-indigo-400 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-800/60 border-indigo-500/20 text-slate-400'
              }`}
            >
              <span className="text-slate-400">3. EXECUTE</span>
              <span className={isIdle ? 'text-slate-500' : 'text-indigo-300 font-bold'}>
                {activeProcId}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-indigo-500/20 flex items-center justify-between">
              <span className="text-slate-400">4. RETIRE</span>
              <span className="text-purple-400 font-bold">COMMIT</span>
            </div>
          </div>

          {/* Bus activity bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>ALU Data Bus Throughput</span>
              <span className="text-indigo-300 font-mono">64-bit Direct</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isIdle
                    ? 'w-0 bg-slate-600'
                    : 'w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 animate-shimmer'
                }`}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

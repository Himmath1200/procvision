import React, { useState, useEffect, useRef } from 'react';
import { getProcessColor } from '../utils/colors.js';
import { Clock, Info, ShieldAlert, Play, Pause, RotateCcw, FastForward, Cpu, Eye, EyeOff } from 'lucide-react';
import CpuCoreVisualizer from './CpuCoreVisualizer.jsx';

export default function GanttChart({
  timeline = [],
  preemptions = [],
  title = 'CPU Execution Gantt Chart',
}) {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [show3dCore, setShow3dCore] = useState(true);

  const totalSimulationTime = timeline.length > 0 ? timeline[timeline.length - 1].endTime : 0;

  // Playback timer loop
  useEffect(() => {
    let intervalId = null;
    if (isPlaying && totalSimulationTime > 0) {
      intervalId = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= totalSimulationTime) {
            setIsPlaying(false);
            return totalSimulationTime;
          }
          return Math.min(totalSimulationTime, prev + 1);
        });
      }, 700 / speed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, totalSimulationTime, speed]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center shadow-xs">
        <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <h4 className="text-sm font-semibold text-slate-700">Gantt Chart Empty</h4>
        <p className="text-xs text-slate-400 mt-0.5">
          Execute the scheduling simulation to view the timeline visualization.
        </p>
      </div>
    );
  }

  // Find currently active segment according to playbackTime
  const activePlaybackSegment = timeline.find(
    (seg) => playbackTime >= seg.startTime && playbackTime < seg.endTime
  ) || timeline[timeline.length - 1];

  const handleTogglePlay = () => {
    if (playbackTime >= totalSimulationTime) {
      setPlaybackTime(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setPlaybackTime((prev) => Math.min(totalSimulationTime, prev + 1));
  };

  return (
    <div className="space-y-6">
      
      {/* 3D Hardware Telemetry Core View */}
      {show3dCore && (
        <CpuCoreVisualizer
          currentSegment={activePlaybackSegment}
          currentTime={playbackTime}
          totalTime={totalSimulationTime}
          isRunning={isPlaying}
        />
      )}

      {/* Main Gantt Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 card-3d">
        
        {/* Title, Playback toolbar & 3D toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[11px] font-mono text-slate-500 font-normal">
                (Total Duration: {totalSimulationTime} units)
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Playback time slice step-by-step or hover to inspect boundaries.
            </p>
          </div>

          {/* Interactive Playback Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-bold shadow-2xs hover:bg-slate-50 transition-all"
                title={isPlaying ? 'Pause simulation playback' : 'Play simulation playback'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={handleStepForward}
                disabled={playbackTime >= totalSimulationTime}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors disabled:opacity-40"
                title="Step forward 1 time unit"
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleResetPlayback}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                title="Reset scrubber to time 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed toggle */}
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-xl text-xs font-mono border border-slate-200">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    speed === s ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Toggle 3D visualizer */}
            <button
              type="button"
              onClick={() => setShow3dCore((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold transition-colors"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{show3dCore ? 'Hide 3D Core' : 'Show 3D Core'}</span>
            </button>

          </div>
        </div>

        {/* Gantt Bars Display with Animated Scrubber */}
        <div className="relative pt-2 pb-6 overflow-x-auto">
          <div className="min-w-[640px] relative">
            
            {/* Main Visual Bar Container */}
            <div className="relative flex h-16 w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner bg-slate-50">
              {timeline.map((segment, index) => {
                const duration = segment.endTime - segment.startTime;
                const widthPct = Math.max(3, (duration / totalSimulationTime) * 100);
                const colors = getProcessColor(segment.processId, index);
                const isIdle = segment.isIdle;
                const isActiveInPlayback =
                  playbackTime >= segment.startTime && playbackTime <= segment.endTime;

                return (
                  <div
                    key={`${segment.processId}-${segment.startTime}-${index}`}
                    style={{ width: `${widthPct}%` }}
                    onMouseEnter={() => setHoveredSegment(segment)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    className={`relative group flex flex-col items-center justify-center cursor-pointer transition-all border-r last:border-r-0 border-white/40 ${
                      isIdle
                        ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        : `${colors.bg} text-white hover:opacity-90`
                    } ${isActiveInPlayback && isPlaying ? 'ring-2 ring-indigo-400 z-10 brightness-110' : ''}`}
                  >
                    <span className="font-bold text-xs tracking-wide truncate px-1">
                      {segment.label}
                    </span>
                    <span className="text-[10px] opacity-80 font-mono">
                      {duration}u
                    </span>
                  </div>
                );
              })}

              {/* Glowing vertical scrubber line during playback */}
              {totalSimulationTime > 0 && (
                <div
                  style={{
                    left: `${(playbackTime / totalSimulationTime) * 100}%`,
                  }}
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] pointer-events-none transition-all duration-200 z-20"
                >
                  <div className="absolute -top-1.5 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-xs" />
                </div>
              )}
            </div>

            {/* Timestamp Rulers Below Bar */}
            <div className="relative h-6 mt-2 w-full text-slate-500 font-mono text-[11px]">
              <span className="absolute left-0 top-0 -translate-x-1/2">
                {timeline[0]?.startTime || 0}
              </span>

              {timeline.map((segment, index) => {
                const positionPct = (segment.endTime / totalSimulationTime) * 100;
                return (
                  <div
                    key={`time-${segment.endTime}-${index}`}
                    style={{ left: `${positionPct}%` }}
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                  >
                    <div className="w-0.5 h-1.5 bg-slate-300 mb-0.5" />
                    <span className="font-semibold text-slate-700">{segment.endTime}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Hover / Playback details card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs flex items-center justify-between min-h-[48px]">
          {hoveredSegment ? (
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 rounded-full font-bold font-mono text-[11px] ${
                  hoveredSegment.isIdle
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {hoveredSegment.label}
              </span>
              <span className="text-slate-600">
                Start: <strong className="font-mono text-slate-800">{hoveredSegment.startTime}</strong>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">
                End: <strong className="font-mono text-slate-800">{hoveredSegment.endTime}</strong>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">
                Duration: <strong className="font-mono text-slate-800">{hoveredSegment.duration} units</strong>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <Info className="w-4 h-4 text-slate-400" />
              <span>Current Simulation Step: <strong>{playbackTime} / {totalSimulationTime} units</strong></span>
            </div>
          )}
        </div>

        {/* Preemption Event Logs */}
        {preemptions && preemptions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Preemption Events Detected ({preemptions.length})</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {preemptions.map((p, idx) => (
                <div
                  key={idx}
                  className="text-[11px] p-2 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900 flex items-start justify-between gap-2 transition-transform hover:scale-[1.01]"
                >
                  <div>
                    <span className="font-mono font-bold text-amber-800">
                      [@ Time {p.time}]:
                    </span>{' '}
                    <span>{p.reason}</span>
                  </div>
                  <span className="font-mono text-[10px] bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 font-semibold shrink-0">
                    Switch
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

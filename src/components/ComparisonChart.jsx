import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { Trophy, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';

export default function ComparisonChart({ sjfResult, srtfResult }) {
  if (!sjfResult?.metrics || !srtfResult?.metrics) {
    return null;
  }

  const sjf = sjfResult.metrics;
  const srtf = srtfResult.metrics;

  // Primary Time Metrics (lower is better)
  const timeMetricsData = [
    {
      name: 'Avg Waiting Time',
      unit: 'ms',
      lowerIsBetter: true,
      SJF: sjf.avgWaitingTime,
      SRTF: srtf.avgWaitingTime,
    },
    {
      name: 'Avg Turnaround Time',
      unit: 'ms',
      lowerIsBetter: true,
      SJF: sjf.avgTurnaroundTime,
      SRTF: srtf.avgTurnaroundTime,
    },
    {
      name: 'Avg Response Time',
      unit: 'ms',
      lowerIsBetter: true,
      SJF: sjf.avgResponseTime,
      SRTF: srtf.avgResponseTime,
    },
  ];

  // System Efficiency Metrics (higher is better)
  const efficiencyMetricsData = [
    {
      name: 'CPU Utilization (%)',
      unit: '%',
      lowerIsBetter: false,
      SJF: sjf.cpuUtilization,
      SRTF: srtf.cpuUtilization,
    },
    {
      name: 'Throughput',
      unit: 'procs/u',
      lowerIsBetter: false,
      SJF: Number((sjf.throughput * 100).toFixed(2)), // Scale for clear visualization or display
      SRTF: Number((srtf.throughput * 100).toFixed(2)),
      actualSjf: sjf.throughput,
      actualSrtf: srtf.throughput,
    },
  ];

  // Helper to determine winner dynamically
  const determineWinner = (sjfVal, srtfVal, lowerIsBetter = true) => {
    if (sjfVal === srtfVal) return { winner: 'Tie', text: 'Equal performance' };
    if (lowerIsBetter) {
      return sjfVal < srtfVal
        ? { winner: 'SJF', text: `SJF is ${((1 - sjfVal / srtfVal) * 100).toFixed(1)}% faster` }
        : { winner: 'SRTF', text: `SRTF is ${((1 - srtfVal / sjfVal) * 100).toFixed(1)}% faster` };
    } else {
      return sjfVal > srtfVal
        ? { winner: 'SJF', text: `SJF is higher` }
        : { winner: 'SRTF', text: `SRTF is higher` };
    }
  };

  const metricCards = [
    {
      name: 'Average Waiting Time (WT)',
      sjf: sjf.avgWaitingTime,
      srtf: srtf.avgWaitingTime,
      unit: 'units',
      eval: determineWinner(sjf.avgWaitingTime, srtf.avgWaitingTime, true),
    },
    {
      name: 'Average Turnaround Time (TAT)',
      sjf: sjf.avgTurnaroundTime,
      srtf: srtf.avgTurnaroundTime,
      unit: 'units',
      eval: determineWinner(sjf.avgTurnaroundTime, srtf.avgTurnaroundTime, true),
    },
    {
      name: 'Average Response Time (RT)',
      sjf: sjf.avgResponseTime,
      srtf: srtf.avgResponseTime,
      unit: 'units',
      eval: determineWinner(sjf.avgResponseTime, srtf.avgResponseTime, true),
    },
    {
      name: 'CPU Utilization',
      sjf: `${sjf.cpuUtilization}%`,
      srtf: `${srtf.cpuUtilization}%`,
      unit: '',
      eval: determineWinner(sjf.cpuUtilization, srtf.cpuUtilization, false),
    },
    {
      name: 'System Throughput',
      sjf: sjf.throughput,
      srtf: srtf.throughput,
      unit: 'proc/unit',
      eval: determineWinner(sjf.throughput, srtf.throughput, false),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Comparative Evaluation Highlights */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Dynamic Benchmark Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {metricCards.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 truncate">{m.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    m.eval.winner === 'SRTF'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : m.eval.winner === 'SJF'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {m.eval.winner === 'Tie' ? 'Tie' : `${m.eval.winner} Wins`}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 font-mono text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-sans">SJF (Non-Preemptive)</div>
                  <div className="font-bold text-blue-600">{m.sjf} {m.unit}</div>
                </div>
                <div className="text-slate-300">vs</div>
                <div className="space-y-0.5 text-right">
                  <div className="text-[10px] text-slate-400 font-sans">SRTF (Preemptive)</div>
                  <div className="font-bold text-purple-600">{m.srtf} {m.unit}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{m.eval.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Comparative Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Timing Metrics Comparison (Average WT, TAT, RT)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Lower values represent faster response and shorter waiting times.
          </p>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timeMetricsData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="SJF" name="SJF (Non-Preemptive)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="SRTF" name="SRTF (Preemptive)" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

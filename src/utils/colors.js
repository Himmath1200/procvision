/**
 * Process color palette for consistent visualization across Gantt chart, tables, and graphs
 */

export const PROCESS_COLORS = [
  { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-500', hex: '#3b82f6', lightBg: 'bg-blue-50' },
  { bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-500', hex: '#a855f7', lightBg: 'bg-purple-50' },
  { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-500', hex: '#10b981', lightBg: 'bg-emerald-50' },
  { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-500', hex: '#f59e0b', lightBg: 'bg-amber-50' },
  { bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-500', hex: '#f43f5e', lightBg: 'bg-rose-50' },
  { bg: 'bg-cyan-500', text: 'text-cyan-700', border: 'border-cyan-500', hex: '#06b6d4', lightBg: 'bg-cyan-50' },
  { bg: 'bg-indigo-500', text: 'text-indigo-700', border: 'border-indigo-500', hex: '#6366f1', lightBg: 'bg-indigo-50' },
  { bg: 'bg-teal-500', text: 'text-teal-700', border: 'border-teal-500', hex: '#14b8a6', lightBg: 'bg-teal-50' },
  { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-500', hex: '#f97316', lightBg: 'bg-orange-50' },
  { bg: 'bg-fuchsia-500', text: 'text-fuchsia-700', border: 'border-fuchsia-500', hex: '#d946ef', lightBg: 'bg-fuchsia-50' },
];

export function getProcessColor(processId, index = 0) {
  if (processId === 'IDLE' || processId === 'Idle') {
    return {
      bg: 'bg-slate-300',
      text: 'text-slate-600',
      border: 'border-slate-400',
      hex: '#94a3b8',
      lightBg: 'bg-slate-100',
    };
  }

  // Derive stable index from processId number if present (e.g. "P1" -> 0, "P2" -> 1)
  const match = String(processId).match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return PROCESS_COLORS[(num - 1 + PROCESS_COLORS.length) % PROCESS_COLORS.length];
  }

  return PROCESS_COLORS[index % PROCESS_COLORS.length];
}

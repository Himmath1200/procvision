import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Clock, Zap, BarChart3, HelpCircle, Layers, Cpu } from 'lucide-react';

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    to: '/sjf',
    label: 'Module 1: SJF',
    sublabel: 'Non-Preemptive',
    icon: Clock,
    badge: 'Non-Preemptive',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    to: '/srtf',
    label: 'Module 2: SRTF',
    sublabel: 'Preemptive Shortest Remaining',
    icon: Zap,
    badge: 'Preemptive',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    to: '/comparison',
    label: 'Comparative Analysis',
    sublabel: 'SJF vs SRTF Benchmark',
    icon: BarChart3,
    badge: 'Compare',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    to: '/guide',
    label: 'Theory & Formulas',
    sublabel: 'Formulas & Definitions',
    icon: HelpCircle,
    badge: null,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-40 h-[100dvh] lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800">ProcVision</span>
            </div>
            <button
              onClick={onClose}
              className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600"
            >
              Close
            </button>
          </div>

          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => onClose?.()}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-start gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-xs border border-blue-200/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-5 h-5 mt-0.5 shrink-0 ${
                            isActive ? 'text-blue-600' : 'text-slate-400'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded border font-normal ${item.badgeColor}`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.sublabel && (
                            <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                              {item.sublabel}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Algorithm Focus</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              SJF selects the shortest total burst without interruption. SRTF preempts immediately when a shorter remaining job arrives.
            </p>
          </div>
        </div>

        {/* Bottom system footer */}
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
          <span>ProcVision Engine</span>
          <span className="font-mono text-[11px] text-slate-500">v1.0.0</span>
        </div>
      </aside>
    </>
  );
}

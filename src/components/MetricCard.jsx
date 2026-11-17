import React from 'react';

export default function MetricCard({
  title,
  value,
  unit = '',
  icon: Icon,
  description,
  accent = 'blue',
  badgeText,
  badgeType = 'neutral',
}) {
  const accentStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200/80 group-hover:bg-blue-600 group-hover:text-white',
      borderHover: 'hover:border-blue-400',
      topLine: 'from-blue-500 to-indigo-500',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200/80 group-hover:bg-purple-600 group-hover:text-white',
      borderHover: 'hover:border-purple-400',
      topLine: 'from-purple-500 to-pink-500',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white',
      borderHover: 'hover:border-emerald-400',
      topLine: 'from-emerald-500 to-teal-500',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80 group-hover:bg-amber-600 group-hover:text-white',
      borderHover: 'hover:border-amber-400',
      topLine: 'from-amber-500 to-orange-500',
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80 group-hover:bg-indigo-600 group-hover:text-white',
      borderHover: 'hover:border-indigo-400',
      topLine: 'from-indigo-500 to-purple-500',
    },
  }[accent] || {
    iconBg: 'bg-slate-50 text-slate-600 border-slate-200',
    borderHover: 'hover:border-slate-300',
    topLine: 'from-slate-400 to-slate-600',
  };

  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  }[badgeType];

  return (
    <div
      className={`relative overflow-hidden bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs transition-all duration-300 card-3d group ${accentStyles.borderHover}`}
    >
      {/* Top 3D colored accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentStyles.topLine} opacity-80 group-hover:opacity-100 transition-opacity`}
      />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 shadow-2xs ${accentStyles.iconBg}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono drop-shadow-2xs">
          {value !== undefined && value !== null ? value : '-'}
        </span>
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>

      {(description || badgeText) && (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          {description && <span className="text-slate-500 truncate">{description}</span>}
          {badgeText && (
            <span
              className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold shrink-0 shadow-2xs ${badgeStyles}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

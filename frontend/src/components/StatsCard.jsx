import React from 'react';

const StatsCard = ({ title, value, subtitle, accent = 'from-white/10 to-white/5' }) => {
  return (
    <div className={`glass-panel bg-gradient-to-br ${accent} p-5`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="mt-2 text-3xl font-black tracking-tight text-slate-900">{value}</div>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
};

export default StatsCard;

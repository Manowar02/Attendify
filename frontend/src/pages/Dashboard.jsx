import React, { useState } from 'react';
import { Plus, CheckCircle2, MinusCircle, Slash, XCircle, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddSubjectModal from '../components/AddSubjectModal';
import SubjectDetailModal from '../components/SubjectDetailModal';
import AddExtraClassModal from '../components/AddExtraClassModal';
import { calculateAttendanceAdvice, getLocalDateKey } from '../data/helpers';

const statusOptions = [
  { value: 'pending', label: 'Clear', icon: Slash, color: 'slate' },
  { value: 'no-class', label: 'Off', icon: MinusCircle, color: 'amber' },
  { value: 'absent', label: 'Miss', icon: XCircle, color: 'rose' },
  { value: 'present', label: 'Att', icon: CheckCircle2, color: 'emerald' },
];

const activeStyles = {
  slate: 'border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
  amber: 'border-amber-200 bg-amber-50 text-amber-500 dark:border-amber-500/30 dark:bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
  rose: 'border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
};

const formatDashboardDate = () => {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
};

const getAdviceText = (advice) => {
  if (advice.mode === 'neutral') return 'no classes tracked yet';
  if (advice.mode === 'danger') {
    if (advice.value === 0) return "can't miss the next lecture";
    return `need to attend ${advice.value} lecture${advice.value !== 1 ? 's' : ''}`;
  }
  if (advice.value === 0) return "can't miss the next lecture";
  return `can miss ${advice.value} lecture${advice.value !== 1 ? 's' : ''}`;
};

const Dashboard = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const {
    subjects,
    addSubject,
    getOverallStats,
    getSubjectStats,
    getSubjectStatusForDate,
    setSubjectStatusForDate,
    extraClasses,
    removeExtraClass,
    getTodayClasses,
    getDateSubjectStats,
  } = useApp();

  const [addExtraOpen, setAddExtraOpen] = useState(false);

  const overall = getOverallStats();
  const todayKey = getLocalDateKey();
  
  const todayExtraClasses = extraClasses[todayKey] || [];
  const todayTimetableClasses = getTodayClasses();
  
  const todaySubjectIds = new Set([
    ...todayTimetableClasses.map((c) => c.subjectId),
    ...todayExtraClasses.map((c) => c.subjectId),
  ]);

  const subjectStats = subjects
    .filter((subject) => todaySubjectIds.has(subject.id))
    .map((subject) => ({ ...subject, ...getSubjectStats(subject.id) }));

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <header className="flex items-center justify-between gap-3 py-1">
        <span className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300" >
          {formatDashboardDate()}
        </span>
      </header>

      {/* ── Overall Attendance Ring ── */}
      <section className="flex items-center gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-6 py-5 shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
        {/* Ring chart */}
        <div className="relative h-28 w-28 shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: overall.total === 0
                ? 'conic-gradient(#e2e8f0 0% 100%)'
                : `conic-gradient(#10b981 0% ${overall.percentage}%, #f43f5e ${overall.percentage}% ${overall.percentage + (overall.total > 0 ? (overall.absent / overall.total) * 100 : 0)}%, #f59e0b ${overall.percentage + (overall.total > 0 ? (overall.absent / overall.total) * 100 : 0)}% 100%)`,
            }}
          />
          <div className="absolute inset-[6px] rounded-full bg-white dark:bg-ink-900" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white" >
              {overall.percentage}%
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">overall</span>
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="flex flex-1 flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Present</span>
            <span className="ml-auto text-sm font-bold text-slate-900 dark:text-slate-100" >{overall.present}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Absent</span>
            <span className="ml-auto text-sm font-bold text-slate-900 dark:text-slate-100" >{overall.absent}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Off / No class</span>
            <span className="ml-auto text-sm font-bold text-slate-900 dark:text-slate-100" >{overall.noClass}</span>
          </div>
          <div className="mt-0.5 h-px w-full bg-slate-100 dark:bg-slate-800" />
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total tracked</span>
            <span className="ml-auto text-sm font-bold text-slate-900 dark:text-slate-100" >{overall.total}</span>
          </div>
        </div>
      </section>

      {/* ── Subject Cards ── */}
      <section className="space-y-4">
        {subjectStats.map((subject) => {
          const advice = calculateAttendanceAdvice(subject.present, subject.absent, subject.criteria);
          const currentStatus = getDateSubjectStats(subject.id, todayKey);
          const healthy = subject.percentage >= subject.criteria;
          const pctValue = subject.total === 0 ? 0 : ((subject.present / subject.total) * 100);

          return (
            <div
              key={subject.id}
              className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-5 py-5 shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(16,185,129,0.1)]"
              onClick={() => setSelectedSubject(subject)}
            >
              <div className="flex items-start gap-5">
                {/* Left: percentage + criteria */}
                <div className="flex shrink-0 flex-col items-center pt-0.5" style={{ minWidth: '52px' }}>
                  <span
                    className={`text-lg font-bold leading-tight ${healthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}

                  >
                    {pctValue.toFixed(2)}
                  </span>
                  <span className="my-1 h-px w-8 bg-slate-300 dark:bg-slate-700" />
                  <span
                    className={`text-sm font-bold leading-tight ${healthy ? 'text-emerald-500' : 'text-rose-500'}`}

                  >
                    {subject.criteria}
                  </span>
                </div>

                {/* Right: name + advice */}
                <div className="min-w-0 flex-1">
                  <h3
                    className="text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-100"

                  >
                    {subject.name}
                  </h3>
                  <p className={`mt-0.5 text-sm font-medium ${advice.mode === 'danger' ? 'text-rose-600' : advice.mode === 'neutral' ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {getAdviceText(advice)}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex items-center justify-center gap-3">
                {statusOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = currentStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      className={`grid h-10 w-10 place-items-center rounded-full border transition-all ${isActive
                        ? activeStyles[opt.color]
                        : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubjectStatusForDate({ dateKey: todayKey, subjectId: subject.id, status: opt.value });
                      }}
                      type="button"
                      aria-label={opt.label}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Extra Classes Section ── */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Extra Classes</h2>
          <button
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 transition hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
            onClick={() => setAddExtraOpen(true)}
            type="button"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        {todayExtraClasses.length > 0 ? (
          <div className="space-y-3">
            {todayExtraClasses.map((extra) => {
              const sub = subjects.find((s) => s.id === extra.subjectId);
              if (!sub) return null;

              return (
                <div key={extra.id} className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 p-4 shadow-sm">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{sub.name}</h3>
                    <p className={`text-sm font-medium ${extra.status === 'present' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {extra.status === 'present' ? 'Present (Extra)' : 'Absent (Extra)'}
                    </p>
                  </div>
                  <button
                    className="grid h-9 w-9 place-items-center rounded-full bg-slate-50 dark:bg-ink-950 text-slate-400 dark:text-slate-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                    onClick={() => removeExtraClass(todayKey, extra.id)}
                    title="Delete extra class"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No extra classes recorded for today.</p>
        )}
      </section>

      <AddSubjectModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(subject) => {
          addSubject(subject);
          setAddOpen(false);
        }}
      />

      <AddExtraClassModal open={addExtraOpen} onClose={() => setAddExtraOpen(false)} />

      <SubjectDetailModal open={Boolean(selectedSubject)} onClose={() => setSelectedSubject(null)} subject={selectedSubject} />
    </div>
  );
};

export default Dashboard;

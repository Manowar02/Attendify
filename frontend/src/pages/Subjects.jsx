import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateAttendanceAdvice } from '../data/helpers';
import AddSubjectModal from '../components/AddSubjectModal';
import SubjectDetailModal from '../components/SubjectDetailModal';

const Subjects = () => {
  const { subjects, addSubject, getSubjectStats, deleteSubject } = useApp();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between gap-3 rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Attendify</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Subjects</h1>
        </div>

        <button className="rounded-full bg-slate-100 dark:bg-ink-950 p-3 text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-200 dark:hover:bg-ink-800" onClick={() => setAddOpen(true)} type="button" aria-label="Add subject">
          <Plus className="h-5 w-5" />
        </button>
      </section>

      <section className="space-y-4">
        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-ink-950 py-16 text-center">
            <p className="text-base font-medium text-slate-500 dark:text-slate-400">No subjects added yet.</p>
            <button
              onClick={() => setAddOpen(true)}
              className="mt-4 rounded-full bg-slate-200 dark:bg-ink-800 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-300 dark:hover:bg-ink-700"
            >
              Add a Subject
            </button>
          </div>
        ) : (
          subjects.map((subject) => {
          const stats = getSubjectStats(subject.id);
          const advice = calculateAttendanceAdvice(stats.present, stats.absent, subject.criteria);
          const healthy = stats.percentage >= subject.criteria;
          const totalTracked = stats.present + stats.absent;
          const presentShare = totalTracked === 0 ? 0 : (stats.present / totalTracked) * 100;

          return (
            <button
              key={subject.id}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-5 py-5 text-left shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(16,185,129,0.1)]"
              onClick={() => setSelectedSubject(subject)}
              type="button"
            >
              <div className="flex items-center gap-5">
                {/* Ring chart */}
                <div className="relative h-20 w-20 shrink-0">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: totalTracked === 0
                        ? 'conic-gradient(#e2e8f0 0% 100%)'
                        : `conic-gradient(${healthy ? '#10b981' : '#f43f5e'} 0% ${presentShare}%, #e2e8f0 ${presentShare}% 100%)`,
                    }}
                  />
                  <div className="absolute inset-[5px] rounded-full bg-white dark:bg-ink-900" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-base font-bold leading-tight ${healthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                      
                    >
                      {stats.percentage}%
                    </span>
                    <span className="text-[0.55rem] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      /{subject.criteria}
                    </span>
                  </div>
                </div>

                {/* Name + advice + stats */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-100" >
                      {subject.name}
                    </h3>
                    <button
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white dark:bg-ink-950 text-slate-400 dark:text-slate-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete "${subject.name}"? This will remove all associated attendance records and extra classes.`)) {
                          deleteSubject(subject.id);
                        }
                      }}
                      title="Delete subject"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className={`mt-0.5 text-sm font-medium ${advice.mode === 'danger' ? 'text-rose-600 dark:text-rose-400' : advice.mode === 'neutral' ? 'text-amber-500 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {advice.label}: {advice.value}
                  </p>
                  <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />{stats.present}P
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />{stats.absent}A
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />{stats.noClass}O
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />{stats.total}T
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        }))}
      </section>

      <AddSubjectModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(subject) => {
          addSubject(subject);
          setAddOpen(false);
        }}
      />

      <SubjectDetailModal open={Boolean(selectedSubject)} onClose={() => setSelectedSubject(null)} subject={selectedSubject} />
    </div>
  );
};

export default Subjects;
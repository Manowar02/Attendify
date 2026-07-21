import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, MinusCircle, Slash, XCircle, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateAttendanceAdvice, formatDateLabel } from '../data/helpers';

const statusOptions = [
  { value: 'pending', label: 'Clear', icon: Slash, className: 'text-slate-400 dark:text-slate-500' },
  { value: 'no-class', label: 'No class', icon: MinusCircle, className: 'text-amber-500 dark:text-amber-500' },
  { value: 'absent', label: 'Absent', icon: XCircle, className: 'text-rose-500 dark:text-rose-400' },
  { value: 'present', label: 'Present', icon: CheckCircle2, className: 'text-emerald-600 dark:text-emerald-400' },
];

const SubjectDetailModal = ({ open, subject: initialSubject, onClose }) => {
  const { subjects, attendance, subjectStatuses, extraClasses, timetable, getSubjectStats, getSubjectStatusForDate, setSubjectStatusForDate, updateSubjectCriteria } = useApp();
  const subject = initialSubject ? subjects.find((s) => s.id === initialSubject.id) || initialSubject : null;

  const [editingCriteria, setEditingCriteria] = useState(false);
  const [criteriaValue, setCriteriaValue] = useState('');

  const records = useMemo(() => {
    if (!subject) {
      return [];
    }

    const dateSet = new Set();

    Object.entries(subjectStatuses).forEach(([dateKey, dateMap]) => {
      if (dateMap?.[subject.id]) {
        dateSet.add(dateKey);
      }
    });

    Object.entries(attendance).forEach(([dateKey, dateMap]) => {
      const hasSubjectEntry = Object.entries(dateMap || {}).some(([entryId, status]) => {
        if (!status || status === 'pending') {
          return false;
        }

        const timetableEntry = timetable.find((entry) => entry.id === entryId);
        return timetableEntry?.subjectId === subject.id;
      });

      if (hasSubjectEntry) {
        dateSet.add(dateKey);
      }
    });

    const baseRecords = Array.from(dateSet)
      .map((dateKey) => ({
        id: dateKey,
        dateKey,
        status: getSubjectStatusForDate(dateKey, subject.id),
        isExtra: false,
      }));

    Object.entries(extraClasses || {}).forEach(([dateKey, extras]) => {
      extras.forEach((extra) => {
        if (extra.subjectId === subject.id) {
          baseRecords.push({
            id: extra.id,
            dateKey,
            status: extra.status,
            isExtra: true,
          });
        }
      });
    });

    return baseRecords.sort((left, right) => right.dateKey.localeCompare(left.dateKey));
  }, [attendance, extraClasses, getSubjectStatusForDate, subject, subjectStatuses, timetable]);

  const stats = subject ? getSubjectStats(subject.id) : null;
  const advice = subject ? calculateAttendanceAdvice(stats.present, stats.absent, subject.criteria) : null;

  if (!open || !subject || !stats || !advice) {
    return null;
  }

  const handleStatusChange = (dateKey, status) => {
    setSubjectStatusForDate({ dateKey, subjectId: subject.id, status });
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[#eef6f2] dark:bg-ink-950">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden bg-[#eef6f2] dark:bg-ink-950">
        <header className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-4 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:px-6">
          <button className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 dark:bg-ink-800 text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-ink-700" onClick={onClose} type="button" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="grid min-w-0 grid-cols-[auto_1fr] items-center gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-ink-950 px-4 py-2 text-center">
              <div className="text-lg font-black leading-none text-slate-900 dark:text-white">{stats.percentage}%</div>
              {editingCriteria ? (
                <form
                  className="mt-1 flex items-center gap-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const val = Math.min(100, Math.max(0, Number(criteriaValue) || 0));
                    updateSubjectCriteria(subject.id, val);
                    setEditingCriteria(false);
                  }}
                >
                  <input
                    className="w-12 rounded border border-emerald-400 dark:border-emerald-500/50 bg-white dark:bg-ink-900 px-1 py-0.5 text-center text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
                    type="number"
                    min="0"
                    max="100"
                    value={criteriaValue}
                    onChange={(e) => setCriteriaValue(e.target.value)}
                    autoFocus
                    onBlur={() => {
                      const val = Math.min(100, Math.max(0, Number(criteriaValue) || 0));
                      updateSubjectCriteria(subject.id, val);
                      setEditingCriteria(false);
                    }}
                  />
                  <span className="text-[0.6rem] text-slate-400 dark:text-slate-500">%</span>
                </form>
              ) : (
                <button
                  className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-emerald-600 dark:hover:text-emerald-400"
                  onClick={() => {
                    setCriteriaValue(subject.criteria);
                    setEditingCriteria(true);
                  }}
                  type="button"
                  title="Edit criteria"
                >
                  {subject.criteria}%
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 dark:text-white">{subject.name}</h2>
              <p className={`mt-1 text-sm font-medium ${advice.mode === 'danger' ? 'text-rose-600 dark:text-rose-400' : advice.mode === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {advice.label}
              </p>
            </div>
          </div>

        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-28 pt-10 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">{records.length} records</span>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">All dates</span>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">All attendance</span>
          </div>

          <div className="mt-10 space-y-6">
            {records.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                No attendance history yet for this subject.
              </div>
            ) : (
              records.map((record) => {
                const activeStatus = record.status;

                return (
                  <section key={record.id} className="space-y-4">
                    <div className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-4 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:px-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            {formatDateLabel(record.dateKey)}
                            {record.isExtra && (
                              <span className="rounded-md bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                Extra Class
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-3">
                          {record.isExtra ? (
                            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 dark:bg-ink-950 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                              {record.status === 'present' ? 'Present' : record.status === 'absent' ? 'Absent' : record.status}
                            </div>
                          ) : (
                            statusOptions.map((option) => {
                              const Icon = option.icon;
                          const isActive = activeStatus === option.value;

                          return (
                            <button
                              key={option.value}
                              className={`grid h-11 w-11 place-items-center rounded-full border transition ${
                                isActive ? 'border-transparent bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-ink-950 text-slate-300 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-ink-800'
                              }`}
                              onClick={() => handleStatusChange(record.dateKey, option.value)}
                              type="button"
                              aria-label={option.label}
                              title={option.label}
                            >
                              <Icon className={`h-5 w-5 ${option.className}`} />
                            </button>
                          );
                        }))}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default SubjectDetailModal;

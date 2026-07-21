import React, { useMemo, useState } from 'react';
import { CheckCircle2, MinusCircle, Slash, XCircle, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddExtraClassModal from '../components/AddExtraClassModal';
import { formatDateLabel, getLocalDateKey } from '../data/helpers';

const Calendar = () => {
  const { getClassesByDate, getStatusForEntry, getSubjectById, markAttendance, extraClasses, removeExtraClass, subjects } = useApp();
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(getLocalDateKey());
  const [addExtraOpen, setAddExtraOpen] = useState(false);

  const monthGrid = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekday = firstDay.getDay();
    const days = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  const selectedClasses = getClassesByDate(selectedDateKey);
  const selectedDate = new Date(`${selectedDateKey}T00:00:00`);
  const selectedExtraClasses = extraClasses[selectedDateKey] || [];

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-3 rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Calendar</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </h1>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-ink-950 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {selectedClasses.length} class{selectedClasses.length === 1 ? '' : 'es'}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <button className="secondary-button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} type="button">
            Previous
          </button>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
          <button className="secondary-button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} type="button">
            Next
          </button>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2">
          {monthGrid.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="min-h-24 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-950" />;
            }

            const dateKey = getLocalDateKey(date);
            const isSelected = dateKey === selectedDateKey;
            const isToday = dateKey === getLocalDateKey();

            return (
              <button
                key={dateKey}
                className={`min-h-24 rounded-3xl border p-3 text-left transition ${
                  isSelected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 hover:bg-slate-50 dark:hover:bg-ink-800'
                }`}
                onClick={() => setSelectedDateKey(dateKey)}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{date.getDate()}</span>
                  {isToday ? <span className="rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white">Today</span> : null}
                </div>
                <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">{date.toLocaleDateString(undefined, { weekday: 'short' })}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formatDateLabel(selectedDateKey)}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">All classes and their current status for the selected day.</p>

        <div className="mt-5 space-y-3">
          {selectedClasses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
              No classes scheduled for this day.
            </div>
          ) : (
            selectedClasses.map((entry) => {
              const subject = getSubjectById(entry.subjectId);
              const status = getStatusForEntry(selectedDateKey, entry.id);

              return (
                <div key={entry.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-ink-950 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">{entry.time}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{subject?.name}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{entry.room}</p>
                    </div>
                    <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : status === 'absent' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : status === 'no-class' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {status.replace('-', ' ')}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { value: 'present', icon: CheckCircle2, label: 'Att' },
                      { value: 'absent', icon: XCircle, label: 'Miss' },
                      { value: 'no-class', icon: MinusCircle, label: 'Off' },
                    ].map((option) => {
                      const Icon = option.icon;

                      return (
                        <button
                          key={option.value}
                          className={`inline-flex items-center gap-1 rounded-2xl px-3 py-2 text-xs font-bold transition ${
                            status === option.value ? 'bg-emerald-600 text-white dark:bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                          onClick={() => markAttendance({ dateKey: selectedDateKey, timetableEntryId: entry.id, status: option.value })}
                          type="button"
                        >
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </button>
                      );
                    })}

                    <button
                      className="inline-flex items-center gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
                      onClick={() => markAttendance({ dateKey: selectedDateKey, timetableEntryId: entry.id, status: 'pending' })}
                      type="button"
                    >
                      <Slash className="h-4 w-4" />
                      Clear
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Extra Classes Section ── */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Extra Classes</h3>
            <button
              className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 transition hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
              onClick={() => setAddExtraOpen(true)}
              type="button"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {selectedExtraClasses.length > 0 ? (
            <div className="space-y-3">
              {selectedExtraClasses.map((extra) => {
                const sub = subjects.find((s) => s.id === extra.subjectId);
                if (!sub) return null;

                return (
                  <div key={extra.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-ink-950 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sub.color }} />
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{sub.name}</h4>
                      </div>
                      <p className={`mt-1 text-sm font-medium ${extra.status === 'present' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {extra.status === 'present' ? 'Present (Extra)' : 'Absent (Extra)'}
                      </p>
                    </div>
                    <button
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white dark:bg-ink-900 text-slate-400 dark:text-slate-500 shadow-sm transition hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                      onClick={() => removeExtraClass(selectedDateKey, extra.id)}
                      title="Delete extra class"
                      type="button"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No extra classes recorded for this date.</p>
          )}
        </div>
      </section>

      <AddExtraClassModal open={addExtraOpen} onClose={() => setAddExtraOpen(false)} dateKey={selectedDateKey} />
    </div>
  );
};

export default Calendar;

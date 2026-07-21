import React, { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dayOptions } from '../data/helpers';

const Timetable = () => {
  const { subjects, timetable, addTimetableEntry, deleteTimetableEntry, getSubjectById } = useApp();
  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(todayLabel);
  const [open, setOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');

  useEffect(() => {
    if (!selectedSubjectId && subjects[0]?.id) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [selectedSubjectId, subjects]);

  const dayEntries = useMemo(() => timetable.filter((entry) => entry.day === selectedDay), [selectedDay, timetable]);

  const openAddSheet = () => {
    if (!selectedSubjectId && subjects[0]?.id) {
      setSelectedSubjectId(subjects[0].id);
    }

    setOpen(true);
  };

  const closeAddSheet = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedSubjectId) {
      return;
    }

    addTimetableEntry({
      day: selectedDay,
      subjectId: selectedSubjectId,
    });

    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-heading">Timetable</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">Pick a day, then add your subjects directly into that schedule.</p>
        </div>

      </section>

      <section className="glass-panel p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">{selectedDay}</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{dayEntries.length} classes planned</h2>
          </div>
          <button className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-ink-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:text-emerald-700 dark:hover:text-emerald-400" onClick={openAddSheet} type="button">
            Add class
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {dayOptions.map((day) => {
            const active = selectedDay === day.value;

            return (
              <button
                key={day.value}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-emerald-700 text-white shadow-md shadow-emerald-200 dark:shadow-none' : 'bg-slate-100 dark:bg-ink-950 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-ink-800'}`}
                onClick={() => setSelectedDay(day.value)}
                type="button"
              >
                {day.label.slice(0, 3)}
              </button>
            );
          })}
        </div>

        <div className="mt-4 space-y-3">
          {dayEntries.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-ink-950 px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No classes added for this day yet.
            </div>
          ) : (
            dayEntries.map((entry) => {
              const subject = getSubjectById(entry.subjectId);

              return (
                <div key={entry.id} className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 dark:bg-ink-950 text-slate-500 dark:text-slate-400">
                      <span className="grid grid-cols-2 gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-medium text-slate-900 dark:text-slate-100">{subject?.name || 'Unknown subject'}</h3>
                        </div>
                        <button
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-100 dark:border-ink-800 bg-slate-50 dark:bg-ink-950 text-slate-400 dark:text-slate-500 transition hover:border-rose-200 dark:hover:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                          onClick={() => deleteTimetableEntry(entry.id)}
                          title="Delete class"
                          type="button"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/55 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg rounded-[2.25rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">{selectedDay}</p>
                <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">Add class</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Select one of your subjects for this day.</p>
              </div>
              <button className="rounded-full bg-slate-100 dark:bg-ink-800 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-ink-700" onClick={closeAddSheet} type="button">
                Close
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Choose subject</label>
                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {subjects.length === 0 ? (
                    <div className="rounded-[1.25rem] border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-ink-950 px-4 py-5 text-sm text-slate-500 dark:text-slate-400">Add subjects first, then come back here.</div>
                  ) : (
                    subjects.map((subject) => {
                      const active = selectedSubjectId === subject.id;

                      return (
                        <button
                          key={subject.id}
                          className={`flex w-full items-center gap-3 rounded-[1.25rem] border px-4 py-4 text-left transition ${active ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-500/10' : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-ink-900 dark:hover:border-emerald-500/30 dark:hover:bg-ink-800'}`}
                          onClick={() => setSelectedSubjectId(subject.id)}
                          type="button"
                        >
                          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: subject.color || '#10b981' }} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-base font-semibold text-slate-900 dark:text-slate-100">{subject.name}</span>
                            <span className="mt-0.5 block text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">{subject.code || 'Subject'}</span>
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500 dark:bg-ink-950 dark:text-slate-400'}`}>
                            {active ? 'Selected' : 'Tap'}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <button className="w-full rounded-full bg-emerald-700 px-5 py-4 text-base font-bold text-white transition hover:bg-emerald-600" type="submit">
                Add to {selectedDay}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Timetable;

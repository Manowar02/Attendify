import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getLocalDateKey, formatDateLabel } from '../data/helpers';
import { X } from 'lucide-react';

const AddExtraClassModal = ({ open, onClose, dateKey }) => {
  const { subjects, addExtraClass } = useApp();
  const [subjectId, setSubjectId] = useState('');
  const [status, setStatus] = useState('present');

  useEffect(() => {
    if (open) {
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
      setStatus('present');
    }
  }, [open, subjects]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!subjectId) {
      return;
    }

    addExtraClass({
      dateKey: dateKey || getLocalDateKey(),
      subjectId,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/40 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-ink-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Add Extra Class</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Record an extra class for {dateKey && dateKey !== getLocalDateKey() ? formatDateLabel(dateKey) : 'today'}</p>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 dark:bg-ink-800 text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-ink-700 hover:text-slate-600 dark:hover:text-slate-300"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
            <select
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-ink-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-ink-900"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            >
              <option value="" disabled>Select subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'present', label: 'Present', color: 'emerald' },
                { value: 'absent', label: 'Absent', color: 'rose' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border py-3 text-sm font-semibold transition-all ${
                    status === opt.value
                      ? `border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700 shadow-sm dark:bg-${opt.color}-500/10 dark:text-${opt.color}-400`
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-ink-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={(e) => setStatus(e.target.value)}
                    className="hidden"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <button
            className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
            type="submit"
            disabled={!subjectId}
          >
            Save Extra Class
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExtraClassModal;

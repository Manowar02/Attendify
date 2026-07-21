import React, { useEffect, useState } from 'react';

const AddSubjectModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({ name: '', criteria: 75, attended: 0, missed: 0, off: 0 });

  useEffect(() => {
    if (open) {
      setForm({ name: '', criteria: 75, attended: 0, missed: 0, off: 0 });
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    onSave({
      name: form.name.trim(),
      criteria: Number(form.criteria || 75),
      attended: Number(form.attended || 0),
      missed: Number(form.missed || 0),
      off: Number(form.off || 0),
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg rounded-[2.25rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 p-5 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Add Subject</h2>
          </div>
          <button className="rounded-full bg-slate-100 dark:bg-ink-800 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-ink-700" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-emerald-700 dark:text-emerald-400">Subject name (required)</label>
            <input
              className="w-full rounded-[1rem] border-2 border-emerald-700 dark:border-emerald-500/50 bg-white dark:bg-ink-950 px-4 py-4 text-base text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-600 dark:focus:border-emerald-400"
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Enter subject name"
              value={form.name}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-emerald-700 dark:text-emerald-400">Attendance criteria (%)</label>
            <input
              className="w-full rounded-[1rem] border border-slate-300 dark:border-slate-700 bg-white dark:bg-ink-950 px-4 py-4 text-base text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-600 dark:focus:border-emerald-400"
              onChange={(event) => setForm({ ...form, criteria: event.target.value })}
              placeholder="75"
              type="number"
              min="0"
              max="100"
              value={form.criteria}
            />
            <p className="mt-2 px-2 text-sm text-slate-500 dark:text-slate-400">Minimum attendance % required (e.g. 75)</p>
          </div>

          <div>
            <p className="mb-3 text-lg font-medium text-slate-700 dark:text-slate-300">Attendance count:</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'attended', label: 'Attended' },
                { key: 'missed', label: 'Missed' },
                { key: 'off', label: 'Off' },
              ].map((field) => (
                <label key={field.key} className="rounded-[1rem] border border-slate-300 dark:border-slate-700 bg-white dark:bg-ink-950 p-3 text-center shadow-sm">
                  <span className="block text-sm text-slate-700 dark:text-slate-300">{field.label}</span>
                  <input
                    className="mt-3 w-full border-0 bg-transparent text-center text-2xl font-black text-slate-400 dark:text-slate-500 outline-none"
                    min="0"
                    onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                    type="number"
                    value={form[field.key]}
                  />
                </label>
              ))}
            </div>
            <p className="mt-4 px-2 text-center text-sm text-slate-500 dark:text-slate-400">Starting mid-semester? You can enter your current attendance count above.</p>
          </div>

          <button className="w-full rounded-full bg-emerald-700 px-5 py-4 text-base font-bold text-white transition hover:bg-emerald-600" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;

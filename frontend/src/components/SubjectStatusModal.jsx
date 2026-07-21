import React, { useEffect, useState } from 'react';

const statusOptions = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'no-class', label: 'No class' },
];

const SubjectStatusModal = ({ open, subject, defaultDate, currentStatus, onClose, onSave }) => {
  const [form, setForm] = useState({ dateKey: defaultDate, status: 'present' });

  useEffect(() => {
    if (open) {
      setForm({
        dateKey: defaultDate,
        status: currentStatus && currentStatus !== 'pending' ? currentStatus : 'present',
      });
    }
  }, [open, defaultDate, currentStatus]);

  if (!open || !subject) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Update status</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{subject.name}</h3>
            <p className="mt-1 text-sm text-slate-500">Set the attendance status for a specific day.</p>
          </div>
          <button className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Day</label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
              onChange={(event) => setForm({ ...form, dateKey: event.target.value })}
              type="date"
              value={form.dateKey}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    form.status === option.value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => setForm({ ...form, status: option.value })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500" type="submit">
            Save status
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubjectStatusModal;

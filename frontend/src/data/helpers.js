export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const dayOptions = dayNames.map((day) => ({
  label: day,
  value: day,
}));

export const getLocalDateKey = (dateInput = new Date()) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateLabel = (dateInput) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

export const formatShortDate = (dateInput) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

export const calculateAttendanceAdvice = (present, absent, criteria) => {
  const total = present + absent;

  if (total === 0) {
    return { mode: 'neutral', value: 0, label: 'No classes tracked yet' };
  }

  const current = (present / total) * 100;

  if (current < criteria) {
    if (criteria >= 100) {
      return { mode: 'danger', value: absent > 0 ? absent : 0, label: 'No more absences allowed' };
    }

    const required = Math.max(0, Math.ceil(((criteria / 100) * total - present) / (1 - criteria / 100)));
    return {
      mode: 'danger',
      value: required,
      label: 'Classes to attend to recover',
    };
  }

  if (criteria === 0) {
    return { mode: 'success', value: 0, label: 'No attendance criteria set' };
  }

  const canMiss = Math.max(0, Math.floor((present * 100) / criteria - total));
  return {
    mode: 'success',
    value: canMiss,
    label: 'Classes you can miss safely',
  };
};

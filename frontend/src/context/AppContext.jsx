import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getLocalDateKey } from '../data/helpers';

// Configure axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
axios.defaults.withCredentials = true;

const AppContext = createContext(null);

const initialState = {
  user: null,
  subjects: [],
  timetable: [],
  attendance: {},
  subjectStatuses: {},
  extraClasses: {},
  isLoading: true,
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: user } = await axios.get('/api/auth/me');
        if (user) {
          await loadUserData(user);
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    fetchInitialData();
  }, []);

  const loadUserData = async (user) => {
    try {
      const [subjectsRes, timetableRes, attendanceRes] = await Promise.all([
        axios.get('/api/subjects'),
        axios.get('/api/timetable'),
        axios.get('/api/attendance'),
      ]);

      const subjects = subjectsRes.data.map(s => ({ ...s, id: s._id }));
      const timetable = timetableRes.data.map(t => ({ ...t, id: t._id }));
      
      const attendanceData = attendanceRes.data;

      setState({
        user,
        subjects,
        timetable,
        attendance: attendanceData.attendance || {},
        subjectStatuses: attendanceData.subjectStatuses || {},
        extraClasses: attendanceData.extraClasses || {},
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load user data', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const login = async ({ email, password }) => {
    try {
      const { data: user } = await axios.post('/api/auth/login', { email, password });
      await loadUserData(user);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const { data: user } = await axios.post('/api/auth/register', { name, email, password });
      await loadUserData(user);
      toast.success('Registered successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setState({ ...initialState, isLoading: false });
      toast.success('Logged out');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const addSubject = async (subject) => {
    try {
      const { data } = await axios.post('/api/subjects', subject);
      const newSub = { ...data, id: data._id };
      setState((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSub],
      }));
      toast.success('Subject added');
    } catch (error) {
      toast.error('Failed to add subject');
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      await axios.delete(`/api/subjects/${subjectId}`);
      setState((prev) => {
        const nextSubjects = prev.subjects.filter((s) => s.id !== subjectId);
        const nextTimetable = prev.timetable.filter((tt) => tt.subjectId !== subjectId);
        return {
          ...prev,
          subjects: nextSubjects,
          timetable: nextTimetable,
        };
      });
      // Sync state locally
      toast.success('Subject deleted');
      loadUserData(state.user);
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  const updateSubjectCriteria = async (subjectId, criteria) => {
    try {
      await axios.put(`/api/subjects/${subjectId}`, { criteria });
      setState((prev) => ({
        ...prev,
        subjects: prev.subjects.map((subject) =>
          subject.id === subjectId ? { ...subject, criteria: Number(criteria) } : subject,
        ),
      }));
      toast.success('Criteria updated');
    } catch (error) {
      toast.error('Failed to update criteria');
    }
  };

  const addTimetableEntry = async (entry) => {
    try {
      const { data } = await axios.post('/api/timetable', entry);
      const newEntry = { ...data, id: data._id };
      setState((prev) => ({
        ...prev,
        timetable: [...prev.timetable, newEntry],
      }));
      toast.success('Class added to timetable');
    } catch (error) {
      toast.error('Failed to add to timetable');
    }
  };

  const deleteTimetableEntry = async (entryId) => {
    try {
      await axios.delete(`/api/timetable/${entryId}`);
      setState((prev) => ({
        ...prev,
        timetable: prev.timetable.filter((entry) => entry.id !== entryId),
      }));
      toast.success('Class removed from timetable');
    } catch (error) {
      toast.error('Failed to remove from timetable');
    }
  };

  const markAttendance = async ({ dateKey = getLocalDateKey(), timetableEntryId, status }) => {
    try {
      // Optimistic update
      setState((prev) => ({
        ...prev,
        attendance: {
          ...prev.attendance,
          [dateKey]: {
            ...(prev.attendance[dateKey] || {}),
            [timetableEntryId]: status,
          },
        },
      }));
      await axios.post('/api/attendance/mark', { dateKey, timetableEntryId, status });
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const setSubjectStatusForDate = async ({ dateKey = getLocalDateKey(), subjectId, status }) => {
    try {
      setState((prev) => {
        const nextDateStatuses = { ...(prev.subjectStatuses[dateKey] || {}) };
        if (status === 'pending') {
          delete nextDateStatuses[subjectId];
        } else {
          nextDateStatuses[subjectId] = status;
        }
        return {
          ...prev,
          subjectStatuses: {
            ...prev.subjectStatuses,
            [dateKey]: nextDateStatuses,
          },
        };
      });
      await axios.post('/api/attendance/subject-status', { dateKey, subjectId, status });
    } catch (error) {
      toast.error('Failed to set status');
    }
  };

  const addExtraClass = async ({ dateKey = getLocalDateKey(), subjectId, status }) => {
    try {
      await axios.post('/api/attendance/extra-class', { dateKey, subjectId, status });
      // Re-fetch attendance state to get the generated IDs
      const { data: attendanceData } = await axios.get('/api/attendance');
      setState((prev) => ({
        ...prev,
        extraClasses: attendanceData.extraClasses || {},
      }));
      toast.success('Extra class recorded');
    } catch (error) {
      toast.error('Failed to add extra class');
    }
  };

  const removeExtraClass = async (dateKey, classId) => {
    try {
      await axios.delete('/api/attendance/extra-class', { data: { dateKey, classId } });
      setState((prev) => {
        const dayExtras = prev.extraClasses[dateKey] || [];
        return {
          ...prev,
          extraClasses: {
            ...prev.extraClasses,
            [dateKey]: dayExtras.filter((cls) => cls.id !== classId),
          },
        };
      });
      toast.success('Extra class removed');
    } catch (error) {
      toast.error('Failed to remove extra class');
    }
  };

  // Utility getters

  const getSubjectById = (subjectId) => state.subjects.find((subject) => subject.id === subjectId) || null;

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString(undefined, { weekday: 'long' });
    return state.timetable.filter((entry) => entry.day === today);
  };

  const getClassesByDate = (dateInput) => {
    const weekday = new Date(dateInput).toLocaleDateString(undefined, { weekday: 'long' });
    return state.timetable.filter((entry) => entry.day === weekday);
  };

  const getStatusForEntry = (dateKey, timetableEntryId) => {
    const entryStatus = state.attendance[dateKey]?.[timetableEntryId];
    if (entryStatus && entryStatus !== 'pending') return entryStatus;

    const entry = state.timetable.find((e) => e.id === timetableEntryId);
    if (entry) {
      const subjectStatus = state.subjectStatuses[dateKey]?.[entry.subjectId];
      if (subjectStatus && subjectStatus !== 'pending') return subjectStatus;
    }
    
    return 'pending';
  };

  const getSubjectStatusForDate = (dateKey, subjectId) => state.subjectStatuses[dateKey]?.[subjectId] || 'pending';

  const getDateSubjectStats = (subjectId, dateKey) => {
    const directStatus = getSubjectStatusForDate(dateKey, subjectId);
    if (directStatus !== 'pending') return directStatus;

    const entries = state.timetable.filter((entry) => entry.subjectId === subjectId);
    const matchingEntryIds = entries.map((entry) => entry.id);
    const dateEntries = state.attendance[dateKey] || {};
    const statuses = matchingEntryIds
      .map((entryId) => dateEntries[entryId])
      .filter((status) => status && status !== 'pending');

    if (statuses.includes('present')) return 'present';
    if (statuses.includes('absent')) return 'absent';
    if (statuses.includes('no-class')) return 'no-class';

    return 'pending';
  };

  const getSubjectStats = (subjectId) => {
    const subject = getSubjectById(subjectId);
    const basePresent = Number(subject?.attended || 0);
    const baseAbsent = Number(subject?.missed || 0);
    const baseOff = Number(subject?.off || 0);

    let present = 0;
    let absent = 0;
    let noClass = 0;
    const countedDates = new Set();

    Object.entries(state.subjectStatuses).forEach(([dateKey, dateStatuses]) => {
      const status = dateStatuses?.[subjectId];
      if (!status) return;

      countedDates.add(dateKey);
      if (status === 'present') present += 1;
      else if (status === 'absent') absent += 1;
      else if (status === 'no-class') noClass += 1;
    });

    Object.entries(state.attendance).forEach(([dateKey, dateEntries]) => {
      if (countedDates.has(dateKey)) return;

      Object.entries(dateEntries).forEach(([entryId, status]) => {
        const timetableEntry = state.timetable.find((entry) => entry.id === entryId);
        if (!timetableEntry || timetableEntry.subjectId !== subjectId) return;

        if (status === 'present') present += 1;
        else if (status === 'absent') absent += 1;
        else if (status === 'no-class') noClass += 1;
      });
    });

    // Count extra classes
    Object.entries(state.extraClasses || {}).forEach(([, dayExtras]) => {
      dayExtras.forEach((extra) => {
        if (extra.subjectId === subjectId) {
          if (extra.status === 'present') present += 1;
          else if (extra.status === 'absent') absent += 1;
          else if (extra.status === 'no-class') noClass += 1;
        }
      });
    });

    present += basePresent;
    absent += baseAbsent;
    noClass += baseOff;

    const total = present + absent;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

    return { present, absent, noClass, total, percentage };
  };

  const getOverallStats = () => {
    let present = 0;
    let absent = 0;
    let totalNoClass = 0;

    state.subjects.forEach((subject) => {
      const stats = getSubjectStats(subject.id);
      present += stats.present;
      absent += stats.absent;
      totalNoClass += stats.noClass;
    });

    const total = present + absent;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

    return { present, absent, noClass: totalNoClass, total, percentage };
  };

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      addSubject,
      deleteSubject,
      updateSubjectCriteria,
      addTimetableEntry,
      deleteTimetableEntry,
      markAttendance,
      getSubjectById,
      getSubjectStats,
      getDateSubjectStats,
      getOverallStats,
      getTodayClasses,
      getClassesByDate,
      getStatusForEntry,
      getSubjectStatusForDate,
      setSubjectStatusForDate,
      addExtraClass,
      removeExtraClass,
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
};

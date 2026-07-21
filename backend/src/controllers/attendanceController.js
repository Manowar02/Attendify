import AttendanceState from '../models/AttendanceState.js';

// Helper to get or create state
const getAttendanceState = async (userId) => {
  let state = await AttendanceState.findOne({ user: userId });
  if (!state) {
    state = await AttendanceState.create({ user: userId });
  }
  return state;
};

// @route   GET /api/attendance
export const getAttendance = async (req, res) => {
  try {
    const state = await getAttendanceState(req.user._id);
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/attendance/mark
export const markAttendance = async (req, res) => {
  const { dateKey, timetableEntryId, status } = req.body;
  try {
    const state = await getAttendanceState(req.user._id);
    
    let dateEntries = state.attendance.get(dateKey);
    if (!dateEntries) {
      state.attendance.set(dateKey, new Map());
      dateEntries = state.attendance.get(dateKey);
    }
    
    dateEntries.set(timetableEntryId, status);
    await state.save();
    
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/attendance/subject-status
export const setSubjectStatus = async (req, res) => {
  const { dateKey, subjectId, status } = req.body;
  try {
    const state = await getAttendanceState(req.user._id);
    
    let dateStatuses = state.subjectStatuses.get(dateKey);
    if (!dateStatuses) {
      state.subjectStatuses.set(dateKey, new Map());
      dateStatuses = state.subjectStatuses.get(dateKey);
    }
    
    if (status === 'pending') {
      dateStatuses.delete(subjectId);
    } else {
      dateStatuses.set(subjectId, status);
    }
    
    await state.save();
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/attendance/extra-class
export const addExtraClass = async (req, res) => {
  const { dateKey, subjectId, status } = req.body;
  try {
    const state = await getAttendanceState(req.user._id);
    
    let dayExtras = state.extraClasses.get(dateKey);
    if (!dayExtras) {
      state.extraClasses.set(dateKey, []);
      dayExtras = state.extraClasses.get(dateKey);
    }
    
    dayExtras.push({ id: `ext-${Date.now()}`, subjectId, status });
    await state.save();
    
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/attendance/extra-class
export const removeExtraClass = async (req, res) => {
  const { dateKey, classId } = req.body;
  try {
    const state = await getAttendanceState(req.user._id);
    
    let dayExtras = state.extraClasses.get(dateKey);
    if (dayExtras) {
      const filteredExtras = dayExtras.filter(cls => cls.id !== classId);
      state.extraClasses.set(dateKey, filteredExtras);
      await state.save();
    }
    
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

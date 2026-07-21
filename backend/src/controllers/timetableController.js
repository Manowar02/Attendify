import TimetableEntry from '../models/TimetableEntry.js';

// @route   GET /api/timetable
export const getTimetable = async (req, res) => {
  try {
    const entries = await TimetableEntry.find({ user: req.user._id });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/timetable
export const addTimetableEntry = async (req, res) => {
  const { day, subjectId, room } = req.body;
  try {
    const entry = await TimetableEntry.create({
      user: req.user._id,
      day,
      subjectId,
      room: room || '',
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/timetable/:id
export const deleteTimetableEntry = async (req, res) => {
  try {
    const entry = await TimetableEntry.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }
    
    await entry.deleteOne();
    res.json({ message: 'Timetable entry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

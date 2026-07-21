import Subject from '../models/Subject.js';

// @route   GET /api/subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/subjects
export const createSubject = async (req, res) => {
  const { name, criteria, color, attended, missed, off } = req.body;
  try {
    const subject = await Subject.create({
      user: req.user._id,
      name,
      criteria: criteria || 75,
      color: color || '#10b981',
      attended: attended || 0,
      missed: missed || 0,
      off: off || 0,
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/subjects/:id
export const updateSubjectCriteria = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    subject.criteria = req.body.criteria || subject.criteria;
    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/subjects/:id
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    await subject.deleteOne();
    res.json({ message: 'Subject removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

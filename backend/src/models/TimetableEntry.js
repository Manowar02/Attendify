import mongoose from 'mongoose';

const timetableEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    day: {
      type: String,
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Subject',
    },
    room: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const TimetableEntry = mongoose.model('TimetableEntry', timetableEntrySchema);

export default TimetableEntry;

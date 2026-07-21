import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    criteria: {
      type: Number,
      required: true,
      default: 75,
    },
    color: {
      type: String,
      required: true,
      default: '#10b981',
    },
    attended: {
      type: Number,
      default: 0,
    },
    missed: {
      type: Number,
      default: 0,
    },
    off: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;

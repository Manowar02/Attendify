import mongoose from 'mongoose';

const attendanceStateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    attendance: {
      type: Map,
      of: {
        type: Map,
        of: String,
      },
      default: {},
    },
    subjectStatuses: {
      type: Map,
      of: {
        type: Map,
        of: String,
      },
      default: {},
    },
    extraClasses: {
      type: Map,
      of: [
        {
          id: String,
          subjectId: String,
          status: String,
        },
      ],
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceState = mongoose.model('AttendanceState', attendanceStateSchema);

export default AttendanceState;

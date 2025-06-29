import { Schema, model, Document, Types, models } from "mongoose";


export interface IAttendanceData extends Document {
  userId: Types.ObjectId;
  sessionId: Types.ObjectId;
  organizationId: Types.ObjectId;
  status: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
}

const attendanceDataSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "AttendanceSession",
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    status: {
      type: String,
      enum: ["Hadir", "Terlambat", "Mangkir"],
      required: true,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

attendanceDataSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

const AttendanceData = models?.AttendanceData || model("AttendanceData", attendanceDataSchema);

export default AttendanceData;

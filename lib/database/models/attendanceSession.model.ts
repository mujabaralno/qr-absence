import { Schema, model, models, Document } from "mongoose";

// Interface untuk data yang belum dipopulate
export interface IAttendanceSession extends Document {
  _id: string;
  sessionName: string;
  description?: string;
  locationMeeting: {
    address: string;
    lat: number;
    lng: number;
  }
  startTime: Date;
  endTime: Date;
  qr_code?: string;
  createBy: string; // ObjectId sebagai string
  organizationId: string; // ObjectId sebagai string
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface untuk data yang sudah dipopulate
export interface IAttendanceSessionPopulated extends Document {
  _id: string;
  sessionName: string;
  description?: string;
  locationMeeting: {
    address: string;
    lat: number;
    lng: number;
  }
  startTime: Date;
  endTime: Date;
  qr_code?: string;
  createBy: { _id: string, firstName: string, lastName: string }
  organizationId: { _id: string, organizationName: string }
  createdAt?: Date;
  updatedAt?: Date;
}

const AttendanceSessionSchema = new Schema(
  {
    sessionName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    locationMeeting: {
      address: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },    
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    qr_code: {
      type: String,
    },
    createBy: { // Pastikan nama field konsisten
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceSession = models?.AttendanceSession || model("AttendanceSession", AttendanceSessionSchema);

export default AttendanceSession;
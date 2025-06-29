"use server";

import { connectToDatabase } from "@/lib/database/mongoose";
import AttendanceData from "@/lib/database/models/attendancedata.model"
import AttendanceSession from "@/lib/database/models/attendanceSession.model";
import User from "@/lib/database/models/user.model";
import { handleError } from "@/utils";
import Organization from "@/lib/database/models/organization.model";

export const getAllAttendanceByOrganizationId = async (organizationId: string) => {
  try {
    await connectToDatabase();
    const attendances = await AttendanceData.find({ organizationId })
      .populate({
        path: "userId",
        model: User,
        select: "_id firstName lastName photo email",
      })
      .populate({
        path: "sessionId",
        model: AttendanceSession,
        select: "sessionName createdAt",
      })
      .populate({
        path: "organizationId",
        model: Organization,
        select: "_id organizationName",
      })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(attendances));
  } catch (error) {
    handleError(error);
    throw new Error("Failed to get Organization Attendance");
  }
};

// Get attendance data for specific session
export const getAttendanceBySessionId = async (sessionId: string) => {
  try {
    await connectToDatabase();
    const attendances = await AttendanceData.find({ sessionId })
      .populate({
        path: "userId",
        model: User,
        select: "_id firstName lastName photo email",
      })
      .populate({
        path: "organizationId",
        model: Organization,
        select: "_id organizationName",
      })
      .lean();
    return JSON.parse(JSON.stringify(attendances));
  } catch (error) {
    handleError(error);
    throw new Error("Failed to get Session Attendance");
  }
};



// Get all users in organization for attendance management
export const getUsersByOrganizationId = async (organizationId: string) => {
  try {
    await connectToDatabase();
    const users = await User.find({ organizationId })
      .select("_id firstName lastName email photo")
      .lean();
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    handleError(error);
    throw new Error("Failed to get organization users");
  }
};

// Create or update attendance
export const createOrUpdateAttendance = async (attendanceData: {
  userId: string;
  sessionId: string;
  organizationId: string;
  status: "Hadir" | "Mangkir" | "Terlambat";
}) => {
  try {
    await connectToDatabase();
    
    // Check if attendance already exists
    const existingAttendance = await AttendanceData.findOne({
      userId: attendanceData.userId,
      sessionId: attendanceData.sessionId,
    });

    if (existingAttendance) {
      // Update existing
      const updatedAttendance = await AttendanceData.findByIdAndUpdate(
        existingAttendance._id,
        { status: attendanceData.status, timestamp: new Date() },
        { new: true }
      );
      return JSON.parse(JSON.stringify(updatedAttendance));
    } else {
      // Create new
      const newAttendance = await AttendanceData.create(attendanceData);
      return JSON.parse(JSON.stringify(newAttendance));
    }
  } catch (error) {
    handleError(error);
    throw new Error("Failed to create/update attendance");
  }
};

export const getAttendanceSummary = async () => {
  try {
    const summary = await AttendanceData.aggregate([
      {
        $group: {
          _id: { month: { $month: "$timestamp" } },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    return JSON.parse(JSON.stringify(summary));
  } catch (error) {
    handleError(error);
    throw new Error("Failed to get Attendance Data");
  }
};
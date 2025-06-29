"use server";

import AttendanceSession from "@/lib/database/models/attendanceSession.model";
import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { CreateAttendanceSessionParams, DeleteAttendanceSessionParams, UpdateAttendanceSessionParams } from "@/types";
import { handleError } from "@/utils";
import { revalidatePath } from "next/cache";
import QRCode from 'qrcode';


const populateAttendance = (query: any) => {
  return query
    .populate({
      path: "createBy", // Bukan "createdBy"
      select: "_id firstName lastName",
    })
    .populate({
      path: "organizationId", 
      select: "_id organizationName",
    });
};

export async function createAttendanceSession({
  attendance,
  userId,
  organizationId,
  path,
}: CreateAttendanceSessionParams) {
  try {
    await connectToDatabase(); 

    const createdByUser = await User.findOne({
      _id: userId,
      organizationId,
    });

    if (!createdByUser) throw new Error("User tidak ditemukan");

    const newAttendance = await AttendanceSession.create({
      ...attendance,
      createBy: userId,
      organizationId,
    });

    const sessionUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/all-session/${newAttendance._id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(sessionUrl);

    newAttendance.qr_code = qrCodeDataUrl;
    await newAttendance.save();

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newAttendance));
  } catch (error) {
    handleError(error);
  }
}

export async function updateAttendaceSession({
  userId,
  attendance,
  organizationId,
  path,
}: UpdateAttendanceSessionParams) {
  try {
    await connectToDatabase();

    const attendanceToUpdate = await AttendanceSession.findById(attendance._id);
    if (
      !attendanceToUpdate ||
      attendanceToUpdate.createBy.toString() !== userId ||
      attendanceToUpdate.organizationId.toString() !== organizationId
    ) {
      throw new Error("Unauthorized or Attendance not found");
    }

    const updatedAttendance = await AttendanceSession.findByIdAndUpdate(
      attendance._id,
      { ...attendance },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedAttendance));
  } catch (error) {
    handleError(error);
  }
}


export async function deleteAttendace({
  attendanceId,
  path,
}: DeleteAttendanceSessionParams) {
  try {
    await connectToDatabase();

    const deletedAttendance = await AttendanceSession.findByIdAndDelete(
      attendanceId
    );
    if (deletedAttendance) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}


export async function getAttendanceByOrganizationId(organizationId: string) {
  try {
    await connectToDatabase();

    const attendanceList = await AttendanceSession.find({
      organizationId,
    }).populate({
      path: "createBy",
      select: "firstName lastName",
    }).populate({
      path: "organizationId", 
      select: "_id organizationName",
    }).sort({ startTime: -1 });

    return JSON.parse(JSON.stringify(attendanceList));
  } catch (error) {
    handleError(error);
    return [];
  }
}


export async function getAttendanceSessionById(sessionId: string) {
  try {
    await connectToDatabase();
    
    const session = await populateAttendance(
      AttendanceSession.findById(sessionId)
    );
    
    if (!session) {
      throw new Error("Session tidak ditemukan");
    }
    
    return JSON.parse(JSON.stringify(session));
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getAttendancesBySessionId(sessionId: string) {
  try {
    await connectToDatabase();

    // Asumsi Anda memiliki model Attendance untuk data kehadiran
    // Sesuaikan dengan struktur database Anda
    const attendances = await AttendanceSession.findById(sessionId)
      .populate({
        path: "attendees", // Sesuaikan dengan field yang menyimpan data kehadiran
        populate: {
          path: "userId",
          model: User,
          select: "firstName lastName email"
        }
      });

    return JSON.parse(JSON.stringify(attendances?.attendees ?? []));
  } catch (error) {
    handleError(error);
    return [];
  }
}


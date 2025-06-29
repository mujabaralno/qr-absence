"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import AttendanceTable from "./AttendanceTable";
import {
  MapPin,
  Clock,
  User,
  Building,
} from "lucide-react";

type AttendanceRecord = {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
  };
  status: "Hadir" | "Mangkir" | "Terlambat";
  timestamp: string;
};

type OrganizationUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
};

type SessionDetailClientProps = {
  attendance: {
    _id: string;
    sessionName: string;
    description: string;
    locationMeeting: {
      address: string;
      lat: number;
      lng: number;
    };
    startTime: string;
    endTime: string;
    qr_code: string;
    createBy?: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    organizationId: {
      _id: string;
      organizationName: string;
    };
  };
  attendanceData: AttendanceRecord[];
  organizationUsers: OrganizationUser[];
};

const SessionDetailClient = ({ 
  attendance, 
  attendanceData, 
  organizationUsers 
}: SessionDetailClientProps) => {
  const qrCodeValue = attendance.qr_code;
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionStatus = () => {
    const now = new Date();
    const start = new Date(attendance.startTime);
    const end = new Date(attendance.endTime);

    if (now < start)
      return { status: "Upcoming", color: "bg-blue-100 text-blue-800" };
    if (now >= start && now <= end)
      return { status: "Active", color: "bg-green-100 text-green-800" };
    return { status: "Completed", color: "bg-gray-100 text-gray-800" };
  };

  const sessionStatus = getSessionStatus();

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {attendance.sessionName}
                </h1>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${sessionStatus.color}`}
                  >
                    {sessionStatus.status}
                  </span>
                  {attendance.organizationId && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span className="text-sm">
                        {attendance.organizationId.organizationName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Link href={`/dashboard/all-session/${attendance._id}/update`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Edit Session
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* QR Code and Session Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* QR Code Section */}
          {qrCodeValue && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="text-center">
                {/* QR Code */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border-2 border-dashed border-gray-300 inline-block">
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <Image
                      src={qrCodeValue}
                      alt="QR Code for attendance"
                      width={280}
                      height={280}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl max-w-md mx-auto">
                  <p className="text-blue-800 font-medium">
                    📱 Use your phone camera or QR scanner app
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Session Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Session Details
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Start Time */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    Start Time
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDateTime(attendance.startTime)}
                  </p>
                </div>
              </div>

              {/* End Time */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    End Time
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDateTime(attendance.endTime)}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">
                    Location
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {attendance.locationMeeting.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coordinates: {attendance.locationMeeting.lat.toFixed(6)},{" "}
                    {attendance.locationMeeting.lng.toFixed(6)}
                  </p>
                </div>
              </div>

              {/* Creator */}
              {attendance.createBy && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      Created By
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {attendance.createBy.firstName}{" "}
                      {attendance.createBy.lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Management Table */}
        <div className="mb-8">
          <AttendanceTable
            sessionId={attendance._id}
            organizationId={attendance.organizationId._id}
            attendanceData={attendanceData}
            allUsers={organizationUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionDetailClient;
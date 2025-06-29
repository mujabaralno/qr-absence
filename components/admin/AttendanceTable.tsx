"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { createOrUpdateAttendance } from "@/actions/attendancedata.actions";

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
  
  type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
  };
  
  type AttendanceTableProps = {
    sessionId: string;
    organizationId: string;
    attendanceData: AttendanceRecord[];
    allUsers: User[];
  };
  
  const AttendanceTable = ({
    sessionId,
    organizationId,
    attendanceData,
    allUsers,
  }: AttendanceTableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [localAttendance, setLocalAttendance] = useState<AttendanceRecord[]>(attendanceData);
    const [isLoading, setIsLoading] = useState(false);
  
    // Create a map of attendance records by userId
    const attendanceMap = new Map(
      localAttendance.map((record) => [record.userId._id, record])
    );
  
    // Merge all users with their attendance status
    const mergedData = allUsers.map((user) => {
      const attendanceRecord = attendanceMap.get(user._id);
      return {
        user,
        attendance: attendanceRecord || null,
        status: attendanceRecord?.status ?? "Mangkir",
      };
    });
  
    // Filter data based on search and status
    const filteredData = mergedData.filter((item) => {
      const matchesSearch = 
        item.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  
    const handleStatusChange = async (userId: string, newStatus: "Hadir" | "Mangkir" | "Terlambat") => {
      setIsLoading(true);
      try {
        await createOrUpdateAttendance({
          userId,
          sessionId,
          organizationId,
          status: newStatus,
        });
  
        // Update local state
        setLocalAttendance((prev) => {
          const existingIndex = prev.findIndex((record) => record.userId._id === userId);
          const user = allUsers.find((u) => u._id === userId);
          
          if (existingIndex >= 0) {
            // Update existing record
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              status: newStatus,
              timestamp: new Date().toISOString(),
            };
            return updated;
          } else {
            // Add new record
            const newRecord: AttendanceRecord = {
              _id: `temp-${userId}`,
              userId: user!,
              status: newStatus,
              timestamp: new Date().toISOString(),
            };
            return [...prev, newRecord];
          }
        });
      } catch (error) {
        console.error("Failed to update attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case "Hadir":
          return "bg-green-100 text-green-800 border-green-200";
        case "Terlambat":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "Mangkir":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };
  
    const getStatusIcon = (status: string) => {
      switch (status) {
        case "Hadir":
          return <UserCheck className="w-4 h-4" />;
        case "Terlambat":
          return <Clock className="w-4 h-4" />;
        case "Mangkir":
          return <UserX className="w-4 h-4" />;
        default:
          return <UserX className="w-4 h-4" />;
      }
    };
  
    const getStatistics = () => {
      const hadir = mergedData.filter((item) => item.status === "Hadir").length;
      const terlambat = mergedData.filter((item) => item.status === "Terlambat").length;
      const mangkir = mergedData.filter((item) => item.status === "Mangkir").length;
      const total = mergedData.length;
  
      return { hadir, terlambat, mangkir, total };
    };
  
    const stats = getStatistics();
  
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Attendance Management</h3>
              <p className="text-sm text-gray-600">
                Members scan QR code to mark attendance • Manual override available for emergencies
              </p>
            </div>
          </div>
        </div>
  
        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">ℹ️</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How Attendance Works:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Members scan the QR code using mobile app to mark attendance automatically</li>
                <li>• Default status is <strong>Mangkir</strong> until QR code is scanned</li>
                <li>• Manual override buttons are available for emergency cases (phone issues, etc.)</li>
                <li>• Late arrivals can be marked manually by admin if needed</li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.hadir}</div>
            <div className="text-sm text-green-600">Hadir</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.terlambat}</div>
            <div className="text-sm text-yellow-600">Terlambat</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.mangkir}</div>
            <div className="text-sm text-red-600">Mangkir</div>
          </div>
        </div>
  
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="Hadir">Hadir</option>
              <option value="Terlambat">Terlambat</option>
              <option value="Mangkir">Mangkir</option>
            </select>
          </div>
        </div>
  
        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-800">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Last Updated</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.user._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {item.user.photo ? (
                          <Image
                            src={item.user.photo}
                            alt={`${item.user.firstName} ${item.user.lastName}`}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {item.user.firstName.charAt(0)}{item.user.lastName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.user.firstName} {item.user.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{item.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {item.attendance?.timestamp
                      ? new Date(item.attendance.timestamp).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      {/* Show manual override buttons only for emergency cases */}
                      {item.status === "Mangkir" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(item.user._id, "Hadir")}
                            disabled={isLoading}
                            className="text-xs text-green-600 border-green-600 hover:bg-green-50"
                            title="Manual override for emergency (e.g., phone issues)"
                          >
                            ✓ Manual Hadir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(item.user._id, "Terlambat")}
                            disabled={isLoading}
                            className="text-xs text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                            title="Manual override for late arrival"
                          >
                            ⏰ Manual Terlambat
                          </Button>
                        </>
                      )}
                      
                      {/* Show reset button for attended users */}
                      {(item.status === "Hadir" || item.status === "Terlambat") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(item.user._id, "Mangkir")}
                          disabled={isLoading}
                          className="text-xs text-red-600 border-red-600 hover:bg-red-50"
                          title="Reset to absent"
                        >
                          ✕ Reset
                        </Button>
                      )}
                      
                      {/* Show attendance method info */}
                      <div className="text-xs text-gray-500">
                        {item.attendance?.timestamp && item.status !== "Mangkir" ? (
                          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                            📱 Via QR Scan
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            Waiting for QR scan...
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria.
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default AttendanceTable;
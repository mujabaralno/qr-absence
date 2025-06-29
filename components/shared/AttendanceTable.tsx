"use client";

import React, { useState, useMemo } from "react";
import { Download, Calendar, Users, FileDown, DatabaseBackup } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as XLSX from "xlsx";

// TypeScript Interfaces
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  email: string;
}

interface AttendanceSession {
  _id: string;
  sessionName: string;
  createdAt: string;
}

interface Organization {
  _id: string;
  organizationName: string;
}

interface AttendanceData {
  _id: string;
  userId: User;
  sessionId: AttendanceSession;
  organizationId: Organization;
  status: "present" | "absent" | "late";
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
  updatedAt: string;
}

interface AttendanceTableProps {
  attendanceData: AttendanceData[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendanceData
}) => {
  const [selectedSession, setSelectedSession] = useState<string>("all");

  // Group attendance by session
  const groupedAttendance = useMemo(() => {
    const grouped = attendanceData.reduce((acc, attendance) => {
      const sessionId = attendance.sessionId._id;
      if (!acc[sessionId]) {
        acc[sessionId] = {
          session: attendance.sessionId,
          attendances: [],
        };
      }
      acc[sessionId].attendances.push(attendance);
      return acc;
    }, {} as Record<string, { session: AttendanceSession; attendances: AttendanceData[] }>);

    return grouped;
  }, [attendanceData]);

  // Get unique sessions for filter
  const sessions = useMemo(() => {
    return Object.values(groupedAttendance).map((group) => group.session);
  }, [groupedAttendance]);

  // Filter data based on selected session
  const filteredData = useMemo(() => {
    if (selectedSession === "all") {
      return attendanceData;
    }
    return groupedAttendance[selectedSession]?.attendances || [];
  }, [selectedSession, attendanceData, groupedAttendance]);

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge variant="default" className="bg-green-500">
            Hadir
          </Badge>
        );
      case "late":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Terlambat
          </Badge>
        );
      case "absent":
        return <Badge variant="destructive">Tidak Hadir</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = filteredData.map((attendance) => ({
      "Nama Lengkap": `${attendance.userId.firstName} ${attendance.userId.lastName}`,
      Email: attendance.userId.email,
      Session: attendance.sessionId.sessionName,
      Status:
        attendance.status === "present"
          ? "Hadir"
          : attendance.status === "late"
          ? "Terlambat"
          : "Tidak Hadir",
      "Check In": formatTime(attendance.checkInTime),
      "Check Out": formatTime(attendance.checkOutTime),
      Tanggal: formatDate(attendance.createdAt),
      Organisasi: attendance.organizationId.organizationName,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Nama Lengkap
      { wch: 25 }, // Email
      { wch: 20 }, // Session
      { wch: 15 }, // Status
      { wch: 12 }, // Check In
      { wch: 12 }, // Check Out
      { wch: 20 }, // Tanggal
      { wch: 20 }, // Organisasi
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Presensi");

    const fileName =
      selectedSession === "all"
        ? "Data_Presensi_Semua_Session.xlsx"
        : `Data_Presensi_${
            sessions.find((s) => s._id === selectedSession)?.sessionName ||
            "Session"
          }.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  // Export to CSV
  const exportToCSV = () => {
    const dataToExport = filteredData.map((attendance) => ({
      "Nama Lengkap": `${attendance.userId.firstName} ${attendance.userId.lastName}`,
      Email: attendance.userId.email,
      Session: attendance.sessionId.sessionName,
      Status:
        attendance.status === "present"
          ? "Hadir"
          : attendance.status === "late"
          ? "Terlambat"
          : "Tidak Hadir",
      "Check In": formatTime(attendance.checkInTime),
      "Check Out": formatTime(attendance.checkOutTime),
      Tanggal: formatDate(attendance.createdAt),
      Organisasi: attendance.organizationId.organizationName,
    }));

    const headers = Object.keys(dataToExport[0] || {});
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) =>
        headers
          .map((header) => `"${row[header as keyof typeof row] || ""}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const fileName =
      selectedSession === "all"
        ? "Data_Presensi_Semua_Session.csv"
        : `Data_Presensi_${
            sessions.find((s) => s._id === selectedSession)?.sessionName ||
            "Session"
          }.csv`;

    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get statistics
  const stats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter((a) => a.status === "present").length;
    const late = filteredData.filter((a) => a.status === "late").length;
    const absent = filteredData.filter((a) => a.status === "absent").length;

    return { total, present, late, absent };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-5">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#25388C] rounded-full shadow-lg">
            <DatabaseBackup className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Data Presensi
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola dan export data kehadiran anggota organisasi
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={exportToExcel} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-white py-8 px-5 mt-5 rounded-2xl shadow-md shadow-black/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
          <Card className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hadir</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.present}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
              <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.late}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
              <div className="h-4 w-4 bg-red-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.absent}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Filter Session
                </CardTitle>
                <CardDescription>
                  Pilih session untuk melihat data presensi spesifik
                </CardDescription>
              </div>

              <Select
                value={selectedSession}
                onValueChange={setSelectedSession}
              >
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Pilih Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Session</SelectItem>
                  {sessions.map((session) => (
                    <SelectItem key={session._id} value={session._id}>
                      {session.sessionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anggota</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Tidak ada data presensi
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((attendance) => (
                      <TableRow key={attendance._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={attendance.userId.photo}
                                alt={`${attendance.userId.firstName} ${attendance.userId.lastName}`}
                              />
                              <AvatarFallback>
                                {attendance.userId.firstName[0]}
                                {attendance.userId.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {attendance.userId.firstName}{" "}
                                {attendance.userId.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {attendance.userId.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {attendance.sessionId.sessionName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(attendance.sessionId.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(attendance.status)}
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">
                            {formatTime(attendance.checkInTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">
                            {formatTime(attendance.checkOutTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(attendance.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceTable;

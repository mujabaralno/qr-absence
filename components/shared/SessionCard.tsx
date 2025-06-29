"use client";

import { Calendar, LocateFixed, Edit3, Trash2, Eye, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { deleteAttendace } from "@/actions/attendanceSession";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner"; // atau toast library yang Anda pakai

type AttendanceSessionCardProps = {
  _id: string;
  sessionName: string;
  locationMeeting: {
    address: string;
  };
  startTime: string;
  endTime: string;
  qr_code?: string;
  organizationId: string;
};

export const SessionCard = ({
  _id,
  sessionName,
  locationMeeting,
  startTime,
  endTime,
  qr_code,
  organizationId,
}: AttendanceSessionCardProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const qrCodeValue = qr_code;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionStatus = () => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) {
      return { status: "upcoming", color: "bg-blue-500", label: "Upcoming" };
    } else if (now >= start && now <= end) {
      return { status: "active", color: "bg-green-500", label: "Active" };
    } else {
      return { status: "completed", color: "bg-gray-400", label: "Completed" };
    }
  };

  const sessionStatus = getSessionStatus();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAttendace({
        attendanceId: _id,
        path: pathname,
      });
      toast.success(`Sesi "${sessionName}" berhasil dihapus`);
      router.refresh(); // Refresh data
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Gagal menghapus sesi. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setShowDropdown(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDropdown(false);
    setShowDeleteDialog(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group relative">
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${sessionStatus.color}`}>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full bg-white opacity-80`}></div>
            {sessionStatus.label}
          </div>
        </div>
      </div>

      {/* More Options Dropdown */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
              <Link href={`/admin/all-session/${_id}?organizationId=${organizationId}`} className="block">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Lihat Detail
                </button>
              </Link>
              
              <Link href={`/admin/all-session/edit/${_id}`} className="block">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Sesi
                </button>
              </Link>
              
              <hr className="my-1 border-gray-100" />
              
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Sesi
              </button>
            </div>
          )}
        </div>
        
        {/* Backdrop to close dropdown */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          ></div>
        )}
      </div>

      <div className="p-6">
        {/* Session Title */}
        <div className="mb-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
            {sessionName}
          </h3>
          
          {/* Location */}
          <div className="flex items-start text-gray-600 mb-3">
            <LocateFixed className="w-4 h-4 mr-3 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{locationMeeting?.address}</span>
          </div>
          
          {/* Time */}
          <div className="flex items-start text-gray-600">
            <Calendar className="w-4 h-4 mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
              <div className="font-medium text-gray-800">
                {formatDate(startTime)}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                sampai {formatDate(endTime)}
              </div>
            </div>
          </div>
        </div>
        
        {/* QR Code Section */}
        {qrCodeValue && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    QR Code Absensi
                  </p>
                  <p className="text-xs text-blue-600">
                    Scan untuk melakukan absensi
                  </p>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Image
                    src={qrCodeValue}
                    alt="QR Code untuk absensi"
                    width={60}
                    height={60}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href={`/admin/all-session/${_id}`} className="flex-1">
            <button className="w-full bg-[#25388C] hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg text-sm">
              <Eye className="w-4 h-4 inline mr-2" />
              Lihat Detail
            </button>
          </Link>
          
          <Link href={`/admin/all-session/edit/${_id}`}>
            <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md">
              <Edit3 className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Sesi Absensi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus sesi <strong>{sessionName}</strong>? 
              Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data attendance yang terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Menghapus..." : "Hapus Sesi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default SessionCard;
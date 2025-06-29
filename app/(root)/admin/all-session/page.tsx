import AdminAttendanceSessionList from "@/components/admin/AdminAttendanceSessionList";
import { auth } from "@clerk/nextjs/server";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const AllSessionPage = async () => {
  const { sessionClaims } = await auth();
  const organizationId = sessionClaims?.organizationId as string;

  return (
    <>
      <section className="relative  overflow-hidden">
        <div className="relative flex w-full justify-between items-center">
          <div className="flex gap-5">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#25388C] rounded-full shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                All Session
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola anggota organisasi dengan mudah
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/admin/create-session">
              <button className="bg-[#25388C] hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Buat Sesi Baru
              </button>
            </Link>
            <Link href="/admin/all-session/all-attendancedata">
              <button className="bg-white border-2 border-[#25388C] text-[#25388C] hover:bg-[#25388C] hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                All Attendance Data
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white min-h-screen py-12 mt-5 rounded-2xl shadow-md shadow-black/10">
        <div className="container mx-auto px-8">
          <AdminAttendanceSessionList organizationId={organizationId} />
        </div>
      </section>
    </>
  );
};

export default AllSessionPage;

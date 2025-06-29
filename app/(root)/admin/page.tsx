import { getAllAttendanceByOrganizationId } from "@/actions/attendancedata.actions";
import { getAttendanceByOrganizationId } from "@/actions/attendanceSession";
import { getUsersByOrganizationId } from "@/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { Calendar, DatabaseBackup, User } from "lucide-react";
import React from "react";

const AdminHome = async () => {
  const now = new Date();
  const { sessionClaims } = await auth();
  const organizationId = sessionClaims?.organizationId as string;
  const allAttendanceData = await getAllAttendanceByOrganizationId(
    organizationId
  );
  const sessions = await getAttendanceByOrganizationId(organizationId);
  const userByOrganization = await getUsersByOrganizationId(organizationId);

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    now
  );
  return (
    <>
      <section className="flex size-full flex-col gap-5 text-white">
        <div className="h-[303px] w-full rounded-[20px] bg-[url(/images/bg-clock.png)] bg-cover">
          <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
            <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal"></h2>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
              <p className="text-lg font-medium text-sky-1 lg:text-2xl">
                {date}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Sessions
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {sessions.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Semua sesi</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Sessions
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {allAttendanceData.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Semua sesi</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <DatabaseBackup className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {userByOrganization.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Semua Users</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <User className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminHome;

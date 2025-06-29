import React from "react";
import { auth } from "@clerk/nextjs/server";
import FormAttendanceSession from "@/components/shared/FormAttendanceSession";
import { CalendarPlus } from "lucide-react";

const CreateSessionPage = async () => {
  const { sessionClaims } = await auth();

  const userId = sessionClaims?.userId as string;
  const organizationId = sessionClaims?.organizationId as string;

  return (
    <>
      <section className="relative  overflow-hidden">
        <div className="relative">
          <div className="flex gap-5">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#25388C] rounded-full shadow-lg">
              <CalendarPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Create New Session
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola anggota organisasi dengan mudah
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="my-8 bg-white p-6 rounded-lg shdaow-2xl shadow-black/10">
        <FormAttendanceSession
          organizationId={organizationId}
          userId={userId}
          type="Create"
        />
      </div>
    </>
  );
};

export default CreateSessionPage;

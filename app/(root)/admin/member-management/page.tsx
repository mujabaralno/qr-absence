import React from "react";
import InviteUser from "@/components/admin/InviteUser";
import { checkRole } from "@/utils/checkRole";
import { redirect } from "next/navigation";
import TableAllUser from "@/components/admin/TableAllUser";
import { auth } from "@clerk/nextjs/server";
import { getUsersByOrganizationId } from "@/actions/user.actions";
import { Users, UserPlus, Crown } from "lucide-react";

const MemberManagementPage = async () => {
  const { sessionClaims } = await auth();
  const isAdmin = await checkRole("admin");

  if (!isAdmin) redirect("/");

  const organizationId = sessionClaims?.organizationId as string;
  const users = await getUsersByOrganizationId(organizationId);

  return (
    <>
      {/* Header Section */}
      <div className="flex gap-5">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#25388C] rounded-full shadow-lg">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Member Management
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola anggota organisasi dengan mudah
          </p>
        </div>
      </div>
      <div className="min-h-screen bg-white p-8 my-6 rounded-2xl shadow-md shadow-black/10">
        <div className="max-w-7xl mx-auto space-y-8">
          {isAdmin && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* User Table Card */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="bg-[#25388C] p-6">
                    <div className="flex items-center gap-3 text-white">
                      <Users className="w-6 h-6" />
                      <h2 className="text-xl font-semibold">Semua Anggota</h2>
                      <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {users.length} anggota
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <TableAllUser users={users} />
                  </div>
                </div>
              </div>
              {/* Invite User Card */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-black/20 shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Undang Anggota Baru
                    </h2>
                  </div>
                  <InviteUser />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberManagementPage;

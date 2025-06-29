import InviteUser from "@/components/superadmin/InviteUser";
import { checkRole } from "@/utils/checkRole";
import Image from "next/image";
import React from "react";
import { getOrganizationById } from "@/actions/organization.actions";
import { formatDateTime } from "@/utils";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Building2,
  Edit3,
  Users,
  ArrowRight,
} from "lucide-react";
import AdminAttendanceSessionList from "@/components/admin/AdminAttendanceSessionList";


type OrganizationProps = {
  _id: string,
  lastName: string,
  firstName: string,
  email: string,
  role: string,
  createdAt: Date
}

export default async function OrganizationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const isSuperAdmin = await checkRole("superadmin");
  const organization = await getOrganizationById(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {isSuperAdmin && (
        <div className="max-w-7xl mx-auto">
          {/* Header with Back Button */}
          <div className="mb-8">
            <Link
              href="/superadmin/organization-management"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Organizations
            </Link>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-[#25388C] px-8 py-6 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-[#F8F8FF] p-4 rounded-xl shadow-lg">
                  <Image
                    src={organization.imageUrl}
                    alt="Organization logo"
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-2">
                    {organization.organizationName}
                  </h1>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Members</p>
                      <p className="text-2xl font-bold">
                        {organization.memberCount || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Active Projects</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Building2 className="w-8 h-8 text-green-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Organization Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      Organization Details
                    </h2>

                    <div className="bg-[#F8F8FF] rounded-xl p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Responsible Person
                          </p>
                          <p className="text-gray-900 font-medium">
                            {organization.responsiblePerson}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Origin
                          </p>
                          <p className="text-gray-900 font-medium">
                            {organization.origin}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Created Date
                          </p>
                          <p className="text-gray-900 font-medium">
                            {formatDateTime(organization.createdAt).dateOnly}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>

                    <div className="space-y-3">
                      <div className="bg-[#F8F8FF] rounded-xl p-4 min-h-[210px] h-full flex flex-col justify-between">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Invite New User
                        </h4>
                        <InviteUser />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full flex mt-6 items-center justify-center gap-2 px-4 py-3 bg-[#25388C] text-white rounded-xl transition-colors duration-200 font-medium shadow-lg hover:shadow-xl">
                <Edit3 className="w-4 h-4" />
                Update Organization
              </button>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <div className="space-y-2">
                <p>{organization.description}</p>
              </div>
            </div>
            {/* Member Organization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Member Organization ({organization.memberCount || 0})
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {organization.members && organization.members.length > 0 ? (
                  organization.members.map((member: OrganizationProps, index: number) => (
                    <div
                      key={member._id || index}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        {member.role && (
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                            {member.role}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {member.createdAt &&
                          formatDateTime(member.createdAt).dateOnly}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No members found</p>
                    <p className="text-sm text-gray-400">
                      Invite users to join this organization
                    </p>
                  </div>
                )}
              </div>

              {organization.members && organization.members.length > 5 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href={`/organization/${id}/members`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    View all members
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="bg-white min-h-screen py-12 mt-5 rounded-2xl shadow-md shadow-black/10">
        <div className="container mx-auto px-8">
          <AdminAttendanceSessionList organizationId={id} />
        </div>
      </section>
    </div>
  );
}

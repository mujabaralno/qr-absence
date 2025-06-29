import React from "react";
import { getAttendanceSessionById } from "@/actions/attendanceSession";
import { getAttendanceBySessionId, getUsersByOrganizationId } from "@/actions/attendancedata.actions";
import SessionDetailClient from "@/components/admin/SessionDetailClient";

const SessionDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  
  // Get session details
  const attendance = await getAttendanceSessionById(id);
  
  const sessionAttendance = await getAttendanceBySessionId(id);
  
  // Get all users in the organization
  const organizationUsers = await getUsersByOrganizationId(
    attendance.organizationId?._id || attendance.organizationId
  );

  return (
    <section>
      <SessionDetailClient 
        attendance={attendance}
        attendanceData={sessionAttendance}
        organizationUsers={organizationUsers}
      />
    </section>
  );
};

export default SessionDetail;
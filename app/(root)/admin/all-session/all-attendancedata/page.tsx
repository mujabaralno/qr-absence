import { getAllAttendanceByOrganizationId } from "@/actions/attendancedata.actions";
import AttendanceTable from "@/components/shared/AttendanceTable";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const AllAttendanceDataPage = async () => {
  const { sessionClaims } = await auth();
  const orgId = sessionClaims?.organizationId as string;
  const attendanceData = await getAllAttendanceByOrganizationId(orgId);
  return (
    <AttendanceTable attendanceData={attendanceData} />
  );
};

export default AllAttendanceDataPage;

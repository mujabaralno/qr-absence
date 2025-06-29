import { getAttendanceByOrganizationId } from "@/actions/attendanceSession";
import SessionCard from "@/components/shared/SessionCard";
import EmptySessionCard from "../shared/EmptySessionCard";
import { Calendar, Clock, Users } from "lucide-react";

type Props = {
  organizationId: string;
};

type sessionProps = {
  startTime: Date,
  endTime: Date,
}

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

const AdminAttendanceSessionList = async ({ organizationId }: Props) => {
  const sessions = await getAttendanceByOrganizationId(organizationId);

  if (sessions.length === 0) {
    return (
      <div className="w-full">
        <EmptySessionCard />
      </div>
    );
  }

  // Calculate session statistics and separate by status
  const now = new Date();
  const activeSessions = sessions.filter((session: sessionProps) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return now >= start && now <= end;
  });

  const completedSessions = sessions.filter((session: sessionProps) => {
    const end = new Date(session.endTime);
    return now > end;
  });

  const upcomingSessions = sessions.filter((session: sessionProps) => {
    const start = new Date(session.startTime);
    return now < start;
  });

  return (
    <div className="space-y-8">

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{sessions.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{activeSessions.length}</p>
              <p className="text-xs text-gray-500 mt-1">Sedang berlangsung</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-600 mt-1">{completedSessions.length}</p>
              <p className="text-xs text-gray-500 mt-1">Telah selesai</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions Section */}
      {activeSessions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Active Sessions
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {activeSessions.length} sesi sedang berlangsung
              </p>
            </div>
          </div>

          {/* Active Sessions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeSessions.map((session: AttendanceSessionCardProps) => (
              <SessionCard
                key={session._id}
                _id={session._id}
                sessionName={session.sessionName}
                locationMeeting={session.locationMeeting}
                startTime={session.startTime}
                endTime={session.endTime}
                qr_code={session.qr_code}
                organizationId={organizationId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions Section */}
      {upcomingSessions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Upcoming Sessions
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {upcomingSessions.length} sesi akan datang
              </p>
            </div>
          </div>

          {/* Upcoming Sessions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingSessions.map((session: AttendanceSessionCardProps) => (
              <SessionCard
                key={session._id}
                _id={session._id}
                sessionName={session.sessionName}
                locationMeeting={session.locationMeeting}
                startTime={session.startTime}
                endTime={session.endTime}
                qr_code={session.qr_code}
                organizationId={organizationId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Sessions Section */}
      {completedSessions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-600 flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                Completed Sessions
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {completedSessions.length} sesi telah selesai
              </p>
            </div>
          </div>

          {/* Completed Sessions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {completedSessions.map((session: AttendanceSessionCardProps) => (
              <SessionCard
                key={session._id}
                _id={session._id}
                sessionName={session.sessionName}
                locationMeeting={session.locationMeeting}
                startTime={session.startTime}
                endTime={session.endTime}
                qr_code={session.qr_code}
                organizationId={organizationId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state if no sessions in any category */}
      {activeSessions.length === 0 && upcomingSessions.length === 0 && completedSessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada sesi yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default AdminAttendanceSessionList;
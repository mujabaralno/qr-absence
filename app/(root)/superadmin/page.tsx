"use client";

import { useEffect, useState } from "react";
import { getAllMailRequests } from "@/actions/mailRequest.action";
import { getAllOrganization } from "@/actions/organization.actions";
import { getAllUser } from "@/actions/user.actions";
import {
  Building,
  Mail,
  User,
  TrendingUp,
  TrendingDown,
  Activity,
  ActivityIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
  YAxis,
  XAxis,
  Pie,
  PieChart,
  LabelList,
  Cell,
} from "recharts";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

interface DayData {
  date: string;
  shortDate: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}


interface EmailRequest {
  approved: boolean | null | undefined;
  id?: string;
  email?: string;
  createdAt: Date;
}

type EmailProps = {
  approved: boolean | null | undefined;
};

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  img: string;
  dateJoined: string | Date;
  role: "admin" | "user" | "superadmin";
}

const SuperAdminHome = () => {
  const [loading, setLoading] = useState(true);
  const [mailRequests, setMailRequests] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState<User[]>([]);

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emails, orgs, allUsers] = await Promise.all([
          getAllMailRequests(),
          getAllOrganization(),
          getAllUser(),
        ]);
        setMailRequests(emails);
        setOrganizations(orgs);
        setUsers(allUsers);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const now = new Date();
    setTime(
      now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
    setDate(
      new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(now)
    );

    const timerId = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const processEmailData = () => {
    const last7Days: DayData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      last7Days.push({
        date: dateStr,
        shortDate: date.toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        }),
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      });
    }

    mailRequests.forEach((email: EmailRequest) => {
      const emailDate = new Date(email.createdAt).toISOString().split("T")[0];
      const dayData = last7Days.find((day) => day.date === emailDate);

      if (dayData) {
        dayData.total += 1;
        if (email.approved === true) {
          dayData.approved += 1;
        } else if (email.approved === false) {
          dayData.rejected += 1;
        } else {
          dayData.pending += 1;
        }
      }
    });

    return last7Days;
  };

  const processStatusData = () => {
    const statusCount = { approved: 0, pending: 0, rejected: 0 };
    mailRequests.forEach((email: EmailProps) => {
      if (email.approved === true) statusCount.approved += 1;
      else if (email.approved === false) statusCount.rejected += 1;
      else statusCount.pending += 1;
    });

    return [
      {
        name: "approved",
        value: statusCount.approved,
        fill: "var(--color-approved)",
      },
      {
        name: "pending",
        value: statusCount.pending,
        fill: "var(--color-pending)",
      },
      {
        name: "rejected",
        value: statusCount.rejected,
        fill: "var(--color-rejected)",
      },
    ];
  };

  const emailChartData = processEmailData();
  const statusData = processStatusData();
  const todayEmails = emailChartData[emailChartData.length - 1]?.total || 0;
  const yesterdayEmails = emailChartData[emailChartData.length - 2]?.total || 0;
  const emailTrend = todayEmails - yesterdayEmails;

  // Chart configurations
  const lineChartConfig = {
    total: { label: "Total Email", color: "hsl(var(--chart-1))" },
    approved: { label: "Disetujui", color: "hsl(var(--chart-2))" },
    rejected: { label: "Ditolak", color: "hsl(var(--chart-3))" },
    pending: { label: "Pending", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  const pieChartConfig = {
    approved: { label: "Disetujui", color: "hsl(var(--chart-2))" },
    pending: { label: "Pending", color: "hsl(var(--chart-4))" },
    rejected: { label: "Ditolak", color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

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
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Organization
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {organizations.length ?? 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Semua organisasi
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <Building className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Email
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {mailRequests.length}
                </p>
                {emailTrend !== 0 && (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      emailTrend > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emailTrend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(emailTrend)}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Semua Email
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <Mail className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {users.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Semua Users
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <User className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Modern Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Enhanced Line Chart */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 group">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-white/20 backdrop-blur-sm">
            <div className="flex justify-between items-center w-full">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Aktivitas Email (7 Hari Terakhir)
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  Trend pengiriman email harian dengan analisis mendalam
                </CardDescription>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-b-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/20 to-transparent rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <ChartContainer config={lineChartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={emailChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      {/* Enhanced gradients */}
                      <linearGradient
                        id="totalAreaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366F1"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="50%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#EC4899"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="approvedAreaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10B981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10B981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="rejectedAreaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#EF4444"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#EF4444"
                          stopOpacity={0}
                        />
                      </linearGradient>

                      {/* Glow effects */}
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E5E7EB"
                      strokeOpacity={0.3}
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="shortDate"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                      tickMargin={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-2xl">
                              <p className="font-bold text-gray-800 mb-3 text-center">
                                {label}
                              </p>
                              <div className="space-y-2">
                                {/* FIX: Hapus anotasi tipe dan berikan fallback untuk warna */}
                                {payload.map((entry, index) => (
                                  <div
                                    key={`item-${index}`}
                                    className="flex items-center justify-between gap-4 min-w-[120px]"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full shadow-sm"
                                        // Beri warna default jika entry.color tidak ada
                                        style={{
                                          backgroundColor:
                                            entry.color || "#8884d8",
                                        }}
                                      ></div>
                                      <span className="text-sm font-medium text-gray-700">
                                        {entry.name}
                                      </span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">
                                      {entry.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {/* Main area chart */}
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="url(#totalGradient)"
                      strokeWidth={4}
                      fill="url(#totalAreaGradient)"
                      dot={{
                        fill: "#6366F1",
                        strokeWidth: 3,
                        r: 5,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#6366F1",
                        strokeWidth: 3,
                        stroke: "#fff",
                        filter: "url(#glow)",
                      }}
                    />

                    {/* Approved line */}
                    <Line
                      type="monotone"
                      dataKey="approved"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{
                        fill: "#10B981",
                        strokeWidth: 2,
                        r: 4,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#10B981",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      strokeDasharray="none"
                    />

                    {/* Rejected line */}
                    <Line
                      type="monotone"
                      dataKey="rejected"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{
                        fill: "#EF4444",
                        strokeWidth: 2,
                        r: 4,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#EF4444",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Total Email
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Disetujui
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
                  <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-dashed border-red-300"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Ditolak
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Pie Chart */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 group">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-b border-white/20 backdrop-blur-sm">
            <div className="flex justify-between items-center pb-2">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Status Email
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  Distribusi status persetujuan dengan detail analytics
                </CardDescription>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <ActivityIcon className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-b-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <ChartContainer config={pieChartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {/* Enhanced gradients for pie chart */}
                      <linearGradient
                        id="approvedPieGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="50%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                      <linearGradient
                        id="pendingPieGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#D97706" />
                        <stop offset="100%" stopColor="#B45309" />
                      </linearGradient>
                      <linearGradient
                        id="rejectedPieGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="50%" stopColor="#DC2626" />
                        <stop offset="100%" stopColor="#B91C1C" />
                      </linearGradient>

                      {/* Pie glow effect */}
                      <filter id="pieGlow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0];

                          // Type guards untuk memastikan data yang dibutuhkan ada
                          if (
                            !data ||
                            typeof data.value !== "number" ||
                            !data.payload ||
                            !data.payload.name
                          ) {
                            return null;
                          }

                          const value = data.value;
                          const total = mailRequests?.length || 0;
                          const percentage =
                            total > 0
                              ? ((value / total) * 100).toFixed(1)
                              : "0";

                          return (
                            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-2xl">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full shadow-sm"
                                  style={{
                                    backgroundColor:
                                      data.payload.fill || "#gray",
                                  }}
                                ></div>
                                <div>
                                  <p className="font-bold text-gray-800 text-lg">
                                    {pieChartConfig[
                                      data.payload
                                        .name as keyof typeof pieChartConfig
                                    ]?.label || data.payload.name}
                                  </p>
                                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    {value}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {percentage}% dari total
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={3}
                      stroke="#fff"
                      strokeWidth={3}
                      filter="url(#pieGlow)"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "approved"
                              ? "url(#approvedPieGradient)"
                              : entry.name === "pending"
                              ? "url(#pendingPieGradient)"
                              : "url(#rejectedPieGradient)"
                          }
                          style={{
                            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                          }}
                        />
                      ))}
                      <LabelList
                        dataKey="value"
                        className="fill-white font-bold text-sm"
                        stroke="none"
                        fontSize={14}
                        fontWeight="bold"
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Enhanced Legend with statistics */}
              <div className="space-y-4 mt-8">
                <div className="flex justify-center gap-4">
                  {statusData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          {
                            pieChartConfig[
                              item.name as keyof typeof pieChartConfig
                            ]?.label
                          }
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-500">
                          {((item.value / mailRequests.length) * 100).toFixed(
                            1
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary stats */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">
                      Total Email Requests
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                      {mailRequests.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default SuperAdminHome;

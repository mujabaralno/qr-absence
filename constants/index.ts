export const superAdminNavigation = [
  {
    label: "Dashboard",
    route: "/superadmin",
    icon: "LayoutDashboard",
  },
  {
    label: "Organization Requests",
    route: "/superadmin/organization-request",
    icon: "Building2",
  },
  {
    label: "Organizations Management",
    route: "/superadmin/organization-management",
    icon: "Settings",
  },
  {
    label: "All Users",
    route: "/superadmin/all-user",
    icon: "Users",
  },
];

export const langdingPageNav = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "About us",
    route: "#about",
  },
  {
    label: "Features",
    route: "#features",
  },
  {
    label: "What you get",
    route: "#whatyouget",
  },
];

export const adminNavigation = [
  {
    label: "Home",
    route: "/admin",
    icon: "LayoutDashboard",
  },
  {
    label: "Create Session",
    route: "/admin/create-session",
    icon: "Plus",
  },
  {
    label: "All Session",
    route: "/admin/all-session",
    icon: "Calendar",
  },
  {
    label: "Members Management",
    route: "/admin/member-management",
    icon: "Users",
  },
  {
    label: "Profile",
    route: "/admin/profile",
    icon: "Settings",
  },
];

export const createOrganizationDefaultValues = {
  organizationName: "",
  description: "",
  imageUrl: "",
  responsiblePerson: "",
  origin: "",
  adminEmail: "",
};

export const AttendancSessionDefaultValues = {
  sessionName: "",
  description: "",
  locationMeeting: {
    address: "",
    lat: 0,
    lng: 0,
  },
  startTime: new Date(),
  endTime: new Date(),
};

export const createMailRequestDefaultValue = {
  email: "",
  subjectMail: "",
  organizationName: "",
  responsiblePerson: "",
  organizationPhoto: "",
  origin: "",
  description: "",
};

export const featuresCard = [
  {
    title: "Multi-Tenant System",
    desc: "Setiap organisasi memiliki ruang sistemnya sendiri yang terisolasi dan aman. Admin bisa mengelola anggotanya tanpa campur data dari organisasi lain.",
    image: "/images/multi-tenant.png",
  },
  {
    title: "Cloud Storage",
    desc: "Semua data kehadiran disimpan secara aman di cloud, sehingga dapat diakses kapan saja dan di mana saja tanpa risiko kehilangan data.",
    image: "/images/cloud.png",
  },
  {
    title: "QR Code Attendance",
    desc: "Absensi jadi lebih cepat dan praktis menggunakan pemindaian QR code. Cukup scan lewat aplikasi mobile saat sesi absensi aktif.",
    image: "/images/qr-code.png",
  },
];

export const whatYouGetList = [
  {
    label: "Manajemen Absensi yang Efisien",
    image: "/icons/check-list.svg",
  },
  {
    label: "Keamanan Data Terjamin",
    image: "/icons/check-list.svg",
  },
  {
    label: "Laporan Kehadiran Real-Time",
    image: "/icons/check-list.svg",
  },
  {
    label: "Akses Fleksibel via Mobile & Web",
    image: "/icons/check-list.svg",
  },
  {
    label: "Skalabilitas untuk Semua Organisasi",
    image: "/icons/check-list.svg",
  },
];

export const faqList = [
  {
    value: "item-1",
    question: "Apa itu aplikasi absensi digital multi-tenant?",
    answer:
      "Ini adalah sistem absensi berbasis cloud yang memungkinkan banyak organisasi menggunakan satu platform, namun dengan data dan pengaturan yang terisolasi satu sama lain secara aman.",
  },
  {
    value: "item-2",
    question: "Bagaimana cara mendaftarkan organisasi saya?",
    answer:
      "Cukup isi formulir pendaftaran organisasi di halaman utama. Kami akan meninjau permintaan Anda dan mengaktifkan sistem absensi khusus untuk organisasi Anda.",
  },
  {
    value: "item-3",
    question: "Apakah aplikasi ini mendukung absensi QR code?",
    answer:
      "Ya, sistem ini sepenuhnya mendukung fitur absensi menggunakan QR code yang bisa dipindai oleh anggota melalui aplikasi mobile.",
  },
  {
    value: "item-4",
    question: "Apakah data kehadiran bisa diunduh?",
    answer:
      "Ya, admin dapat mengakses dan mengunduh data laporan kehadiran kapan saja melalui dashboard yang tersedia.",
  },
  {
    value: "item-5",
    question: "Apakah ada biaya untuk menggunakan layanan ini?",
    answer:
      "Untuk saat ini, platform ini dapat digunakan secara gratis selama masa pengujian. Biaya layanan akan diinformasikan jika sistem beralih ke versi produksi.",
  },
];


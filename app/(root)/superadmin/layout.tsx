import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { superAdminNavigation } from "@/constants";
import { checkRole } from "@/utils/checkRole";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
export default async function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  const isSuperAdmin = await checkRole("superadmin");

  if (!isSuperAdmin) return redirect("/unauthorized");

  return (
    <main className="relative">
      <div className="flex bg-[#F8F8FF]">
        <Sidebar item={superAdminNavigation} imageLogo="/icons/scango.svg" width={180} />

        <section className="wrapper">
          <Header />
          <div className="w-full">
            {children}
            <Toaster />
          </div>
        </section>
      </div>
    </main>
  );
}

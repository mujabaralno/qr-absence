import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { adminNavigation } from "@/constants";
import { checkRole } from "@/utils/checkRole";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { getOrganizationById } from "@/actions/organization.actions";
export default async function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId, sessionClaims } = await auth();

  if (!userId) return redirect("/sign-in");

  const isAdmin = await checkRole("admin");

  if (!isAdmin) return redirect("/unauthorized");

  const orgId = sessionClaims?.organizationId as string
  const logoOrg = await getOrganizationById(orgId)

  return (
    <main className="relative">
      <div className="flex bg-[#F8F8FF]">
        <Sidebar item={adminNavigation} width={80} imageLogo={logoOrg.imageUrl} textLogo={logoOrg.organizationName} />

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

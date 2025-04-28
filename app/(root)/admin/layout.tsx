import { checkRole } from "@/utils/checkRole";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const { userId } = await auth()

    if(!userId) return redirect('/sign-in')

    const isAdmin = await checkRole("admin")

    if(isAdmin) return redirect ("/unauthorized")


    return (
      <main lang="en">
          <div>{children}</div>
      </main>
    );
  }
  
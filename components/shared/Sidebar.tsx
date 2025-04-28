"use client";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";


type SidebarItemType = {
    label: string,
    route: string,
    img: string
}

type SideBarProps = {
    item: SidebarItemType[]
}

const Sidebar = ({item}: SideBarProps) => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 left-0 w-[20rem] bg-white shadow-lg p-3 min-h-screen">
      <div className="p-4">
        <Image src="/next.svg" alt="logo" width={100} height={100} />
      </div>

      <div className="mt-10 flex flex-col gap-2">
        {item.map((link) => {
          const isActive = pathname === link.route;

          return (
            <Link className="" href={link.route} key={link.label}>
              <div
                className={cn(
                  "flex gap-4 items-center p-4 rounded-lg justify-start",
                  isActive && "bg-[#25388C] shadow-sm"
                )}
              >
                <div className="relative size-5">
                  <Image
                    src={link.img}
                    alt="icon"
                    fill
                    className={`${
                      isActive ? "brightness-40 invert" : "brightness-200 invert"
                    }  object-contain`}
                  />
                </div>

                <p className={cn(isActive ? "text-white" : "text-dark")}>
                  {link.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
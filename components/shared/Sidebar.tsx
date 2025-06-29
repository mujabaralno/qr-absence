"use client";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { iconMap } from "@/utils/iconsMap";

type SidebarItemType = {
    label: string;
    route: string;
    icon: string;
    size?: number 
}

type SideBarProps = {
    item: SidebarItemType[];
    imageLogo: string;
    width: number;
    textLogo?: string; 
}

const Sidebar = ({ item, imageLogo, width = 80, textLogo }: SideBarProps,) => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 left-0 w-[20rem] bg-white shadow-lg p-3 min-h-screen">
      <div className="mt-4 mb-7 flex flex-row gap-3 items-center">
        {imageLogo && (
          <Image src={imageLogo} alt="logo" width={width} height={100}/>
        )}
        <h2 className="font-bold text-3xl">{textLogo}</h2>
      </div>
      <div className="p-1 border-gray-300 border-dashed border-t-2 mt-3"></div>
      <div className="mt-5 flex flex-col gap-2">
        {item.map((link) => {
          const isActive = pathname === link.route;
          const IconComponent = iconMap[link.icon]; // Get icon from map

          return (
            <Link className="" href={link.route} key={link.label}>
              <div
                className={cn(
                  "flex gap-4 items-center p-4 rounded-lg justify-start",
                  isActive && "bg-[#25388C] border shadow-sm"
                )}
              >
                {IconComponent && (
                  <IconComponent 
                    size={20} 
                    className={cn(
                      isActive ? "text-white" : "text-gray-600"
                    )}
                  />
                )}

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
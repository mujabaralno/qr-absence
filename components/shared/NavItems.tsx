"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { langdingPageNav } from "@/constants";
import Link from "next/link";

const NavItems = () => {
  const pathname = usePathname();
  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {langdingPageNav.map((link) => {
        const isActive = pathname === link.route;

        return (
          <li key={link.label}>
            <Link
              href={link.route}
              className={`${
                isActive ? "text-black" : "text-gray-500"
              } p-medium-14 whitespace-nowrap`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;

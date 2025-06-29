import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";
import { Button } from "../ui/button";
import * as motion from "motion/react-client";
import { navVariants } from "@/utils/motion";

const Navbar = () => {
  return (
    <header className="w-full">
      <motion.div 
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className="wrapper flex justify-between items-center">
        <Link href="/">
          <Image src="/icons/scango.svg" alt="logo next" width={140} height={100} />
        </Link>

        <nav className="md:flex-between md:flex hidden w-full max-w-xs">
          <NavItems />
        </nav>
        <div className="flex flex-row w-32 justify-end gap-4">
          <Button asChild className="rounded-full bg-[#25388C]" size="lg">
            <Link href="/sign-in">Login</Link>
          </Button>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;

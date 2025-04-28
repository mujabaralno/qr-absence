import React from "react";
import { Input } from "../ui/input";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="w-full mb-3">
      <div className="flex justify-between items-center w-full py-2">
        <div>
          <h1 className="h3-bold">Welcome Admin</h1>
          <p className="p-14-medium text-gray-400">
            Monitor all of your projects and tasks here
          </p>
        </div>

        <div className="flex justify-end items-center max-w-xs w-full gap-4">
          <Input 
          placeholder="Search..."
          />
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Header;

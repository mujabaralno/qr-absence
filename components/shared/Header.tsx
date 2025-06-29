import React from "react";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";


const Header = async () => {
  const { sessionClaims } = await auth();

  const getRole = sessionClaims?.role as string;
  return (
    <header className="w-full mb-3">
      <div className="flex justify-between items-center w-full py-2">
        <div>
          <h1 className="h3-bold">Welcome {getRole}</h1>
          <p className="p-14-medium text-gray-400">
            Monitor all of your organization and tasks here
          </p>
        </div>

        <div className="flex justify-end items-center max-w-xs w-full gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Header;

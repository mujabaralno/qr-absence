"use server";
import { Roles } from "@/types/global";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();

  if (!sessionClaims || !sessionClaims.metadata) return false;

  return sessionClaims.metadata.role === role;
};
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/actions/user.actions";

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await getUserById(userId);
  return user;
}

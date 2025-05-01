import { WebhookEvent } from "@clerk/nextjs/server";
import { deleteUser } from "@/actions/user.actions";
import { NextResponse } from "next/server";

export async function handleUserDeleted(evt: WebhookEvent) {
  const { id: deletedUserId } = evt.data;

  if (!deletedUserId) {
    return new Response("User ID not found in event data", { status: 400 });
  }

  try {
    const deletedUser = await deleteUser(deletedUserId);
    return NextResponse.json({ message: "User deleted", user: deletedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    return new Response("Error deleting user", { status: 500 });
  }
}
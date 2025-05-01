import { WebhookEvent } from "@clerk/nextjs/server";
import { updateUser } from "@/actions/user.actions";
import { NextResponse } from "next/server";

export async function handleUserUpdated(evt: WebhookEvent) {
  if (evt.type !== "user.updated") {
    return new Response("Invalid event type", { status: 400 });
  }

  const user = evt.data;

  try {
    const updatedUser = await updateUser(user.id, {
      firstName: user.first_name ?? "",
      lastName: user.last_name ?? "",
      photo: user.image_url,
    });
    return NextResponse.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    return new Response("Error updating user", { status: 500 });
  }
}

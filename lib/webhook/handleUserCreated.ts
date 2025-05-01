import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import { createUser } from "@/actions/user.actions";
import { NextResponse } from "next/server";

export async function handleUserCreated(evt: WebhookEvent) {
  if (evt.type !== "user.created") {
    return new Response("Invalid event type", { status: 400 });
  }

  const user = evt.data;

  const organizationId = user.public_metadata.organizationId as string;
  const role = (user.public_metadata.role as string) || "user";
  const approved = (user.public_metadata.approved as boolean) || false;

  try {
    await connectToDatabase();

    const newUser = await createUser({
      clerkId: user.id,
      email: user.email_addresses[0].email_address,
      firstName: user.first_name ?? "",
      lastName: user.last_name ?? "",
      photo: user.image_url,
      role,
      approved,
      organizationId,
    });

    if (newUser) {
      await (
        await clerkClient()
      ).users.updateUserMetadata(user.id, {
        publicMetadata: { userId: newUser._id, ...user.public_metadata },
      });
    }

    return NextResponse.json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during user creation:", err);
    return new Response("Error during user creation", { status: 500 });
  }
}

// app/api/webhook/clerk/route.ts

import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/actions/user.actions";
import { connectToDatabase } from "@/lib/database/mongoose";

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!CLERK_WEBHOOK_SIGNING_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SIGNING_SECRET to .env");
  }

  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, public_metadata } = evt.data;

    const organizationId = public_metadata.organizationId as string;
    const role = public_metadata.role as string || "user";
    const approved = public_metadata.approved as boolean || false;

    try {
      await connectToDatabase();

      const newUser = await createUser({
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        photo: image_url,
        role: role,
        approved: approved,
        organizationId: organizationId,
      });

      // Setelah buat user di MongoDB, update publicMetadata di Clerk
      if (newUser) {
        const result = await (await clerkClient()).users.updateUserMetadata(id, {
          publicMetadata: { userId: newUser._id, ...public_metadata },
        });
        console.log("New user created:", result);
      }

      return NextResponse.json({ message: "User created successfully" });
    } catch (err) {
      console.error("Error during user creation:", err);
      return new Response("Error during user creation", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id: clerkUserId, image_url, first_name, last_name } = evt.data;

    const user = {
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      photo: image_url,
    };

    try {
      const updatedUser = await updateUser(clerkUserId, user);
      return NextResponse.json({ message: "User updated", user: updatedUser });
    } catch (err) {
      console.error("Error updating user:", err);
      return new Response("Error updating user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
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

  return new Response("OK", { status: 200 });
}

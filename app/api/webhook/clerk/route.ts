import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/actions/user.actions";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred during verification", { status: 400 });
  }

  // Get the ID and type of the event
  const { id } = evt.data;
  const eventType = evt.type;

  // CREATE
  if (eventType === "user.created") {
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      public_metadata,
    } = evt.data;

    const organizationId = public_metadata?.organizationId as string;
    const role = public_metadata?.role as string;
    const approved = public_metadata?.approved as boolean;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name!,
      lastName: last_name!,
      photo: image_url,
      approved,
      role,
      organizationId,
    };

    try {
      const newUser = await createUser(user);
      console.log("User successfully created in DB:", newUser);
      if (newUser) {
        const result = await (
          await clerkClient()
        ).users.updateUserMetadata(id, {
          publicMetadata: { userId: newUser._id, ...public_metadata },
        });
        console.log("New user created:", result);
      }
      return NextResponse.json({ message: "OK", user: newUser });
    } catch (err) {
      console.error("🔥 Failed to create user:", err);
      return new Response("Error occurred during user creation", {
        status: 500,
      });
    }
  }

  // UPDATE
  if (eventType === "user.updated") {
    const {
      id: updatedUserId,
      image_url,
      first_name,
      last_name,
      public_metadata,
    } = evt.data;
    const approved = (public_metadata?.approved as boolean) || false;

    const user = {
      firstName: first_name!,
      lastName: last_name!,
      photo: image_url,
      approved,
    };

    try {
      const updatedUser = await updateUser(updatedUserId, user);
      return NextResponse.json({ message: "OK", user: updatedUser });
    } catch (err) {
      console.error("Error during user update:", err);
      return new Response("Error occurred during user update", { status: 500 });
    }
  }

  // DELETE
  if (eventType === "user.deleted") {
    const { id: deletedUserId } = evt.data;

    try {
      const deletedUser = await deleteUser(deletedUserId!);
      return NextResponse.json({ message: "OK", user: deletedUser });
    } catch (err) {
      console.error("Error during user deletion:", err);
      return new Response("Error occurred during user deletion", {
        status: 500,
      });
    }
  }

  console.log(`Webhook with ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}

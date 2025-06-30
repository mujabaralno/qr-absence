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

  // Get the headers - Fix async handling
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing svix headers");
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
    console.error("❌ Error verifying webhook:", err);
    return new Response("Error occurred during verification", { status: 400 });
  }

  // Get the ID and type of the event
  const { id } = evt.data;
  const eventType = evt.type;
  
  console.log(`🎯 Processing webhook: ${eventType} for ID: ${id}`);

  // CREATE
  if (eventType === "user.created") {
    console.log("📦 Webhook user.created payload:", evt.data);
    
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      public_metadata,
    } = evt.data;
    
    console.log("📦 public_metadata:", public_metadata);

    // Validation - pastikan email_addresses tidak kosong
    if (!email_addresses || email_addresses.length === 0) {
      console.error("❌ No email addresses found in webhook data");
      return new Response("No email addresses found", { status: 400 });
    }

    const organizationId = public_metadata?.organizationId as string;
    const role = public_metadata?.role as string;
    const approved = public_metadata?.approved as boolean;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name || "",
      lastName: last_name || "",
      photo: image_url,
      approved: approved || false,
      role: role || "user",
      organizationId: organizationId || "",
    };

    console.log("👤 Creating user with data:", user);

    try {
      const newUser = await createUser(user);
      
      if (!newUser) {
        console.error("❌ createUser returned null/undefined");
        return new Response("Failed to create user - no result returned", {
          status: 500,
        });
      }
      
      console.log("✅ User successfully created in DB:", newUser);
      
      // Update Clerk metadata
      try {
        const clerkClientInstance = await clerkClient();
        const result = await clerkClientInstance.users.updateUserMetadata(id, {
          publicMetadata: { userId: newUser._id, ...public_metadata },
        });
        console.log("✅ Clerk metadata updated:", result.publicMetadata);
      } catch (metadataError) {
        console.error("⚠️ Failed to update Clerk metadata (non-fatal):", metadataError);
        // Don't fail the webhook for metadata update errors
      }
      
      return NextResponse.json({ 
        message: "OK", 
        user: newUser,
        userId: newUser._id 
      });
      
    } catch (err) {
      console.error("🔥 Failed to create user:", err);
      console.error("🔥 Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        userData: user
      });
      
      return new Response("Error occurred during user creation", {
        status: 500,
      });
    }
  }

  // UPDATE
  if (eventType === "user.updated") {
    console.log("📝 Processing user.updated for ID:", id);
    
    const {
      id: updatedUserId,
      image_url,
      first_name,
      last_name,
      public_metadata,
    } = evt.data;
    
    const approved = (public_metadata?.approved as boolean) || false;

    const user = {
      firstName: first_name || "",
      lastName: last_name || "",
      photo: image_url,
      approved,
    };

    try {
      const updatedUser = await updateUser(updatedUserId, user);
      console.log("✅ User updated successfully:", updatedUser);
      return NextResponse.json({ message: "OK", user: updatedUser });
    } catch (err) {
      console.error("❌ Error during user update:", err);
      return new Response("Error occurred during user update", { status: 500 });
    }
  }

  // DELETE
  if (eventType === "user.deleted") {
    console.log("🗑️ Processing user.deleted for ID:", id);
    
    const { id: deletedUserId } = evt.data;

    try {
      const deletedUser = await deleteUser(deletedUserId!);
      console.log("✅ User deleted successfully:", deletedUser);
      return NextResponse.json({ message: "OK", user: deletedUser });
    } catch (err) {
      console.error("❌ Error during user deletion:", err);
      return new Response("Error occurred during user deletion", {
        status: 500,
      });
    }
  }

  console.log(`⚠️ Unhandled webhook type: ${eventType} with ID: ${id}`);
  return new Response("Webhook received but not processed", { status: 200 });
}
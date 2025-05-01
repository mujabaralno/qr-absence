import { WebhookEvent } from "@clerk/nextjs/server";

import { extractSvixHeaders } from "@/lib/webhook/extractSvixHeaders";
import { verifyWebhook } from "@/lib/webhook/verifyWebhook";
import { handleUserCreated } from "@/lib/webhook/handleUserCreated";
import { handleUserUpdated } from "@/lib/webhook/handleUserUpdated";
import { handleUserDeleted } from "@/lib/webhook/handleUserDeleted";

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) throw new Error("Please add CLERK_WEBHOOK_SIGNING_SECRET to .env");

  const headersResult = await extractSvixHeaders();
  if ("error" in headersResult) return new Response(headersResult.error, { status: 400 });

  const body = await req.text();
  let evt: WebhookEvent;

  try {
    evt = verifyWebhook(secret, body, headersResult.headers);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  switch (evt.type) {
    case "user.created":
      return await handleUserCreated(evt);
    case "user.updated":
      return await handleUserUpdated(evt);
    case "user.deleted":
      return await handleUserDeleted(evt);
    default:
      return new Response("Unhandled event type", { status: 200 });
  }
}
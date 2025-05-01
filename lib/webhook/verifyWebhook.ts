import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

export function verifyWebhook(secret: string, body: string, headers: Record<string, string>): WebhookEvent {
  const wh = new Webhook(secret);
  return wh.verify(body, headers) as WebhookEvent;
}
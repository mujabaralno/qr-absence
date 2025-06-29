"use server";

import MailRequest from "@/lib/database/models/mail.models";
import { connectToDatabase } from "@/lib/database/mongoose";
import { CreateMailRequestProps } from "@/types";
import { handleError } from "@/utils";
import { revalidatePath } from "next/cache";



export async function createMailRequest({
  mail,
  path,
}: CreateMailRequestProps) {
  try {
    await connectToDatabase();

    const newMailRequest = await MailRequest.create({ ...mail, path });

    return JSON.parse(JSON.stringify(newMailRequest));
  } catch (error) {
    handleError(error);
  }
}

// Get all mail requests
export async function getAllMailRequests() {
  try {
    await connectToDatabase();

    const mailRequests = await MailRequest.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Use lean() for better performance

    return JSON.parse(JSON.stringify(mailRequests));
  } catch (error) {
    handleError(error);
    return [];
  }
}

// Get mail requests by status
export async function getMailRequestsByStatus(approved: boolean | null = null) {
  try {
    await connectToDatabase();

    let filter = {};
    if (approved !== null) {
      filter = { approved };
    }

    const mailRequests = await MailRequest.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(mailRequests));
  } catch (error) {
    handleError(error);
    return [];
  }
}

// Update mail request status (approve/reject)
// Di mailRequest.action.ts, update function updateMailRequestStatus

export async function updateMailRequestStatus({
  mailId,
  approved,
  organizationCreated, // Tambahkan parameter ini
  path
}: {
  mailId: string;
  approved: boolean;
  organizationCreated?: boolean; // Optional parameter
  path: string;
}) {
  try {
    await connectToDatabase();

    // Build update object
    const updateData: any = { approved };
    
    // Jika organizationCreated diberikan, tambahkan ke update
    if (organizationCreated !== undefined) {
      updateData.organizationCreated = organizationCreated;
    }

    const updatedRequest = await MailRequest.findByIdAndUpdate(
      mailId,
      updateData,
      { new: true }
    );

    if (!updatedRequest) {
      throw new Error('Mail request not found');
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedRequest));
  } catch (error) {
    console.error('Error updating mail request status:', error);
    throw error;
  }
}

// Delete mail request
export async function deleteMailRequest({
  mailId,
  path
}: {
  mailId: string;
  path: string;
}) {
  try {
    await connectToDatabase();

    const deletedMailRequest = await MailRequest.findByIdAndDelete(mailId);

    if (!deletedMailRequest) {
      throw new Error('Mail request not found');
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify(deletedMailRequest));
  } catch (error) {
    handleError(error);
  }
}


"use server";

import { revalidatePath } from "next/cache";

import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError } from "@/utils";
import { CreateUserParams, UpdateUserParams } from "@/types";
import Organization from "@/lib/database/models/organization.model";

const getOrganizationByName = async (name: string) => {
  return Organization.findOne({ name: { $regex: name, $options: 'i' }})
}

const populateOrganization = (query: any) => {
  return query
    .populate({ path: 'organization', model: Organization, select: '_id organizationName' })
}


// CREATE
export async function createUser( user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create({
      clerkId: user.clerkId,
      email: user.email,
      photo: user.photo,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      approved: user.approved,
      organizationId: user.organizationId,
    });

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

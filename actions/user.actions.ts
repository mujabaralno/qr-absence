"use server";

import { revalidatePath } from "next/cache";

import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError } from "@/utils";
import { CreateUserParams, UpdateUserParams } from "@/types";
import Organization from "@/lib/database/models/organization.model";

const getOrganizationByName = async (name: string) => {
  return Organization.findOne({ name: { $regex: name, $options: "i" } });
};

const populateOrganization = (query: any) => {
  return query.populate({
    path: "organization",
    model: Organization,
    select: "_id organizationName",
  });
};

// CREATE
export async function createUser(user: CreateUserParams) {
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

// in @/actions/user.actions.ts
export async function getAllUser() {
  try {
    await connectToDatabase();
    
    const users = await User.find();
    
    // Ubah setiap user menjadi plain object dengan ID sebagai string
    return users.map((user) => ({
      _id: user._id.toString(), // <<< PENTING: Ubah _id menjadi string
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationId: user.organizationId.toString(), // <<< PENTING: Ubah organizationId menjadi string
      img: user.photo,
      dateJoined: user.createdAt.toISOString(), // Gunakan ISO string untuk konsistensi
      role: user.role,
    }));
  } catch (error) {
    handleError(error);
    return [];
  }
}

//READ BY ID

export async function getUsersByOrganizationId(organizationId: string) {
  try {
    await connectToDatabase();

    const users = await User.find({ organizationId });

    return users.map((user) => ({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      img: user.photo,
      dateJoined: user.createdAt.toLocaleDateString(),
      role: user.role,
    }));
  } catch (error) {
    console.error("Failed to get users by organizationId:", error);
    return [];
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
export async function deleteUser(_id: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ _id });

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

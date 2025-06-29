"use server";

import Organization from "@/lib/database/models/organization.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import mongoose, { PipelineStage } from 'mongoose';
import { handleError } from "@/utils";
import { CreateOrganizationParams, UpdateOrganizationParams, GetAllOrganizationsParams } from "@/types";
import User from "@/lib/database/models/user.model";


// CREATE
export async function createOrganization({organization, path}: CreateOrganizationParams) {
  try {
    await connectToDatabase();

    // Create new organization
    const newOrganization = await Organization.create({...organization, path});

    // Return the created organization
    return JSON.parse(JSON.stringify(newOrganization));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getOrganizationById(organizationId: string) {
  try {
    await connectToDatabase();

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(organizationId) } },
      {
        $lookup: {
          from: 'users', 
          localField: '_id',
          foreignField: 'organizationId', 
          as: 'members'
        }
      },
      {
        $addFields: {
          memberCount: { $size: '$members' }
        }
      },
      {
        $project: {
          'members.password': 0,
          'members.__v': 0,
        }
      }
    ];

    const organizations = await Organization.aggregate(pipeline);
    
    if (!organizations || organizations.length === 0) {
      throw new Error("Organization Not Found");
    }

    return JSON.parse(JSON.stringify(organizations[0]));
  } catch (error) {
    handleError(error);
  }
}

export async function getOrganizationMembers(organizationId: string) {
  try {
    await connectToDatabase();

    const members = await User.find(
      { organizationId }, 
      { password: 0, __v: 0 } // Exclude sensitive fields
    ).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(members));
  } catch (error) {
    handleError(error);
  }
}


// UPDATE
export async function updateOrganization({organization, path}: UpdateOrganizationParams) {
  try {
    await connectToDatabase();

    // Find and update the organization by organizationId
    const updatedOrganization = await Organization.findOneAndUpdate(
      { ...organization }, 
      { new: true } 
    );

    if (!updatedOrganization) throw new Error("Organization Update Failed");

    // Return the updated organization
    return JSON.parse(JSON.stringify(updatedOrganization));
  } catch (error) {
    handleError(error);
  }
}

export async function getAllOrganizations({ query, limit = 6, page, status }: GetAllOrganizationsParams) {
  try {
    await connectToDatabase();

    // Membuat kondisi pencarian berdasarkan organizationName
    const matchCondition: any = {};
    if (query) {
      matchCondition.organizationName = { $regex: query, $options: 'i' };
    }

    if (status && status !== 'all') {
      matchCondition.status = status;
    }
    
    // Menghitung jumlah data yang akan di-skip untuk pagination
    const skipAmount = (Number(page) - 1) * limit;
    
    // 2. Deklarasikan pipeline sebagai array dari PipelineStage
    const pipeline: PipelineStage[] = [
      { $match: matchCondition },
      {
        $lookup: {
          from: 'users', 
          localField: '_id',
          foreignField: 'organizationId', 
          as: 'members'
        }
      },
      {
        $addFields: {
          memberCount: { $size: '$members' }
        }
      },
      {
        $project: {
          members: 0 // Menghapus field members dari hasil karena tidak diperlukan
        }
      },
      { $sort: { createdAt: -1 } }, // Sekarang TypeScript mengerti -1 adalah nilai yang valid
      { $skip: skipAmount },
      { $limit: limit }
    ];

    // Eksekusi aggregation
    const organizations = await Organization.aggregate(pipeline);
    
    // Menghitung total jumlah organizations untuk pagination
    const organizationsCount = await Organization.countDocuments(matchCondition);

    return {
      data: JSON.parse(JSON.stringify(organizations)),
      totalPages: Math.ceil(organizationsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getAllOrganization() {
  try {
    await connectToDatabase();
    
    const organizations = await Organization.find({})
      .sort({ createdAt: -1 }) 
      .lean();
    
    return JSON.parse(JSON.stringify(organizations));
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function updateOrganizationStatus(organizationId: string, status: 'active' | 'inactive') {
  try {
    await connectToDatabase();

    const updatedOrganization = await Organization.findByIdAndUpdate(
      organizationId,
      { status },
      { new: true }
    );

    if (!updatedOrganization) throw new Error("Organization not found");

    return JSON.parse(JSON.stringify(updatedOrganization));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteOrganization(organizationId: string) {
  try {
    await connectToDatabase();

    const deletedOrganization = await Organization.findByIdAndDelete(organizationId);

    if (!deletedOrganization) throw new Error("Organization not found");

    return JSON.parse(JSON.stringify(deletedOrganization));
  } catch (error) {
    handleError(error);
  }
}
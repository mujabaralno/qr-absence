"use server";

import Organization from "@/lib/database/models/organization.model";
import { connectToDatabase } from "@/lib/database/mongoose"; 
import { handleError } from "@/utils";
import { CreateOrganizationParams, UpdateOrganizationParams } from "@/types";

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

    const organization = await Organization.findOne({ organizationId });

    if (!organization) throw new Error("Organization Not Found");

    // Return the organization data
    return JSON.parse(JSON.stringify(organization));
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

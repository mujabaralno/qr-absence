"use client";

import { createOrganization as createOrganizationServer, updateOrganization as updateOrganizationServer } from "@/actions/organization.actions";
import { CreateOrganizationParams, UpdateOrganizationParams } from "@/types";

export async function handleCreateOrganization(params: CreateOrganizationParams) {
  return await createOrganizationServer(params);
}

export async function handleUpdateOrganization(params: UpdateOrganizationParams) {
  return await updateOrganizationServer(params);
}

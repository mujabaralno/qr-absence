// app/api/organization/route.ts
import { NextResponse } from "next/server";
import { createOrganization, updateOrganization } from "@/actions/organization.actions";

export async function POST(req: Request) {
  const { type, organization, path } = await req.json();

  try {
    if (type === "Create") {
      const newOrg = await createOrganization({ organization, path });
      return NextResponse.json(newOrg, { status: 201 });
    }

    if (type === "Update") {
      const updatedOrg = await updateOrganization({ organization, path });
      return NextResponse.json(updatedOrg, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

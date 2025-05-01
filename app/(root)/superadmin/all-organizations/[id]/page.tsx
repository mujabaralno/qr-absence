import InviteUser from "@/components/superadmin/InviteUser";
import { checkRole } from "@/utils/checkRole";
import Image from "next/image";
import React from "react";
import { getOrganizationById } from "@/actions/organization.actions";
import { formatDateTime } from "@/utils";
import { SearchParamProps } from '@/types'

const OrganizationDetailsPage = async ({ params }: SearchParamProps)  => {
  const { id } = params;
  const isSuperAdmin = await checkRole("superadmin");

  const organization = await getOrganizationById(id);

  return (
    <section>
      {isSuperAdmin && (
        <>
          <section className="grid grid-cols-3 gap-7">
            <div className="bg-gray-300 flex justify-center items-center p-5 min-h-[200px] h-full w-full">
              <Image
                src={organization.imageUrl}
                alt="logo organization"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col gap-5">
              <p>{formatDateTime(organization.createdAt).dateOnly}</p>
              <h4>{organization.organizationName}</h4>
              <p>{organization.responsiblePerson}</p>
              <p>{organization.origin}</p>
              <button className="w-full p-2 bg-blue-500 text-white rounded-md">
                update organization
              </button>
            </div>
            <div className="flex items-end w-full">
              <InviteUser />
            </div>
          </section>
          <section></section>
        </>
      )}
    </section>
  );
};

export default OrganizationDetailsPage;

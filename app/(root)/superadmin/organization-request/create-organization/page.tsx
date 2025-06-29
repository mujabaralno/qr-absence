"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FormCreateOrganization from "@/components/superadmin/FormCreateOrganization";

interface PrefilledData {
  organizationName: string;
  adminEmail: string;
  responsiblePerson: string;
  origin: string;
  description: string;
  imageUrl: string;
}

const CreateOrganizationPage = () => {
  const searchParams = useSearchParams();
  const [prefilledData, setPrefilledData] = useState<PrefilledData | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    const requestIdParam = searchParams.get('requestId');
    
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setPrefilledData(decodedData);
      } catch (error) {
        console.error('Error parsing prefilled data:', error);
      }
    }
    
    if (requestIdParam) {
      setRequestId(requestIdParam);
    }
  }, [searchParams]);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper">
          <h3 className="h3-bold text-center sm:text-left">
            {prefilledData ? 'Create Organization from Request' : 'Create Organization'}
          </h3>
          {prefilledData && (
            <p className="text-gray-600 text-center sm:text-left mt-2">
              Data telah diisi otomatis dari email request
            </p>
          )}
        </div>
      </section>

      <div className="wrapper my-8">
        <FormCreateOrganization 
          type="Create" 
          prefilledData={prefilledData}
          requestId={requestId}
        />
      </div>
    </>
  );
};

export default CreateOrganizationPage;
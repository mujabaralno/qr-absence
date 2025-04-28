import React from "react";
import FormCreateOrganization from "@/components/superadmin/FormCreateOrganization";


const CreateOrganizationPage = () => {
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Organization
        </h3>
      </section>

      <div className="wrapper my-8">
        <FormCreateOrganization type="Create" />
      </div>
    </>
  );
};

export default CreateOrganizationPage;

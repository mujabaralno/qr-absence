import MailForm from "@/components/shared/MailForm";
import React from "react";

const RegisterOrganizationPage = () => {
  return (
    <section className="wrapper w-full mt-10">
      <div className="flex flex-col gap-5">
        <h2 className=" h2-semibold w-full max-w-[25rem]">
          Ajukan Pendaftaran Organisasi
        </h2>
        <p className="p-medium-16 text-gray-400">
          Isi formulir di bawah ini untuk mengajukan organisasi Anda agar dapat
          menggunakan sistem absensi digital kami.
        </p>
      </div>

      <div className="w-full mt-12">
        <MailForm />
      </div>
    </section>
  );
};

export default RegisterOrganizationPage;

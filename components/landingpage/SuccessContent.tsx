"use client";
import React from "react"; 
import { useSearchParams } from "next/navigation";
import { CheckCircle, Mail, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const organizationName = searchParams.get("org") || "Organisasi Anda";

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon with Animation */}
      <div className="relative mb-8">
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle className="w-12 h-12 text-blue-600" />
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 rounded-full animate-bounce" 
             style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-800 rounded-full animate-bounce" 
             style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Terima Kasih,{" "}
          <span className="text-blue-600 block md:inline">
            {organizationName}!
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
          Pendaftaran organisasi Anda telah berhasil dikirim dan sedang dalam proses review.
        </p>
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Email Konfirmasi Terkirim
          </h3>
          <p className="text-gray-600 text-sm">
            Kami telah mengirim email konfirmasi ke alamat yang Anda berikan. 
            Silakan periksa inbox Anda.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Proses Review
          </h3>
          <p className="text-gray-600 text-sm">
            Tim kami akan meninjau pendaftaran dalam 1-3 hari kerja. 
            Anda akan mendapat notifikasi via email.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8 border border-green-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Langkah Selanjutnya
        </h3>
        <div className="space-y-3 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-700 text-sm font-medium">1</span>
            </div>
            <p className="text-gray-700">Periksa email untuk konfirmasi pendaftaran</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-700 text-sm font-medium">2</span>
            </div>
            <p className="text-gray-700">Tunggu proses review dari tim kami</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-700 text-sm font-medium">3</span>
            </div>
            <p className="text-gray-700">Dapatkan akses ke sistem absensi digital</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/">
          <Button 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
          >
            Kembali ke Beranda
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        
        <Link href="/register">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-medium transition-all duration-200"
          >
            Daftar Organisasi Lain
          </Button>
        </Link>
      </div>

      {/* Support Contact */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm mb-2">
          Ada pertanyaan? Hubungi kami di:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
          <Link href="mailto:qrendence@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium underline">
            qrendence@gmail.com
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default SuccessContent
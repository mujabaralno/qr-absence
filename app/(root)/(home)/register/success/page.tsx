"use client";
import SuccessContent from "@/components/landingpage/SuccessContent";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
        <p className="text-gray-600">Memuat data...</p>
    </div>
  )
}


const SuccessPage = () => {
  return (
    <section className="wrapper w-full min-h-screen flex items-center justify-center">
      <Suspense fallback={<LoadingSpinner />}>
        <SuccessContent />
      </Suspense>
    </section>
  );
};

export default SuccessPage
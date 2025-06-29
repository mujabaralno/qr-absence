import Image from "next/image";
import React from "react";
import NavItems from "./NavItems";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#F8F8FF]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="wrapper grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/icons/scango.svg"
                alt="Scango Logo"
                width={140}
                height={140}
                className="object-contain"
              />
            </Link>
            
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-md mb-6">
              Guiding your path with tailored solutions and unwavering support, 
              ensuring your peace of mind throughout your journey towards success.
            </p>

            {/* Mobile Disclaimer */}
            <div className="md:hidden">
              <Link 
                href="/disclaimer" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
              >
                Disclaimer
              </Link>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Links
              </h3>
              <div className="space-y-2">
                <NavItems />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 md:py-6">
          <div className="wrapper flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 Alno. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              {/* Desktop Disclaimer */}
              <Link 
                href="/disclaimer" 
                className="hidden md:block text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Disclaimer
              </Link>
              
              {/* Admin Link */}
              <Link 
                href="/sign-in" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors border-l border-gray-300 pl-6"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
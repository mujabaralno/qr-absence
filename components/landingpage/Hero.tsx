import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as motion from "motion/react-client";
import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";

const Hero = () => {
  return (
    <section className="w-full wrapper grid md:grid-cols-2 grid-cols-1 gap-5 mt-10 ">
      <motion.div
        variants={staggerContainer(0.5, 0.8)}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="show"
        className="w-full flex flex-col gap-7 md:max-w-[28rem] "
      >
        <motion.h1
          variants={textVariant(0.5)}
          initial="hidden"
          whileInView="show"
          className="h1-bold"
        >
          Sistem Absensi Digital Multi-Tenant{` `}
            <motion.span 
            variants={textVariant(0.65)}
            initial="hidden"
            whileInView="show"
            className="inline-block relative">
              Terpercaya{" "}
              <Image
                src="/icons/curve.svg"
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </motion.span>
        </motion.h1>
        <motion.p
          variants={textVariant(0.7)}
          initial="hidden"
          whileInView="show"
          className="p-medium-16 text-gray-400"
        >
          Kelola kehadiran dengan mudah, cepat, dan efisien untuk organisasi
          Anda.
        </motion.p>
        <motion.div
          variants={fadeIn("right", "spring", 0.8, 1)}
          className="w-full"
        >
          <Link
            href="/register"
            className="px-4 py-3 bg-[#25388C] rounded-full text-white w-40 flex justify-center items-center font-semibold"
          >
            Daftar Sekarang
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        variants={staggerContainer(0.5, 0.8)}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="show"
        className="w-full flex justify-end"
      >
        <motion.div
          variants={fadeIn("left", "spring", 0.5, 1.2)}
          className="w-full flex justify-end"
        >
          <Image
            src="/images/hero-photo.png"
            alt="hero-photo"
            width={420}
            height={500}
            priority
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

import React from "react";

import * as motion from "motion/react-client";
import { staggerContainer, textVariant } from "@/utils/motion";

const aboutDesc =
  "Aplikasi ini dirancang secara khusus untuk membantu berbagai jenis organisasi — baik sekolah, perusahaan, komunitas, maupun instansi — dalam mengelola kehadiran anggotanya secara digital, efisien, dan terpusat. Dengan memanfaatkan teknologi cloud modern dan sistem berbasis multi-tenant, setiap organisasi akan memiliki lingkungan sistem yang terisolasi, aman, dan terpersonalisasi, tanpa harus berbagi data atau sumber daya dengan organisasi lain. Hal ini memungkinkan admin untuk memantau aktivitas absensi secara real-time, mengelola sesi absensi dengan fleksibel, serta menyajikan data laporan yang akurat dan siap pakai. Sistem ini juga mendukung absensi berbasis QR code, yang mempermudah proses pencatatan kehadiran secara cepat dan minim kecurangan. Semua fitur ini dikembangkan dengan fokus pada kemudahan penggunaan, keamanan data, dan skalabilitas sistem untuk mendukung pertumbuhan setiap organisasi di era digital.";

const About = () => {
  return (
    <section className="bg-[#F8F8FF] w-full">
      <motion.div
        variants={staggerContainer(0.5, 0.8)}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="show"
        className=" wrapper flex flex-col gap-5"
      >
        <motion.h2
          variants={textVariant(0.5)}
          initial="hidden"
          whileInView="show"
          className="pt-12 h2-semibold max-w-[3rem] w-full"
        >
          About Us
        </motion.h2>
        <motion.p
          variants={textVariant(0.8)}
          initial="hidden"
          whileInView="show"
          id="#about"
          className="p-medium-16 text-gray-400 pb-8"
        >
          {aboutDesc}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default About;

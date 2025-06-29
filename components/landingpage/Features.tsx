import { featuresCard } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import * as motion from "motion/react-client";
import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";

const Features = () => {
  return (
    <section id="#features" className="w-full mt-8">
      <div className="wrapper flex-col flex gap-8">
        <motion.div
          variants={staggerContainer(0.5, 0.8)}
          viewport={{ once: true, amount: 0.25 }}
          initial="hidden"
          whileInView="show"
          className="flex w-full md:flex-row flex-col justify-between items-center gap-10"
        >
          <motion.h2
            variants={fadeIn("right", "spring", 0.8, 1)}
            initial="hidden"
            whileInView="show"
            className=" h2-semibold w-full max-w-[15rem]"
          >
            Our Features you can get
          </motion.h2>
          <div className="md:flex-between flex w-full max-w-[25rem]">
            <motion.p
              variants={textVariant(0.7)}
              initial="hidden"
              whileInView="show"
              className="p-medium-16 text-gray-400"
            >
              We offer a variety of interesting features that you can help
              increase yor productivity at work and manage your projrct esaly
            </motion.p>
          </div>
          <motion.div
            variants={fadeIn("left", "spring", 0.8, 1)}
            initial="hidden"
            whileInView="show"
            className="flex flex-row w-42 justify-end gap-4"
          >
            <Link
              href=""
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
          className="grid md:grid-cols-3 grid-cols-1 gap-6"
        >
          {featuresCard.map((item, i) => {
            return (
              <motion.div
                variants={textVariant(i * 0.6)}
                initial="hidden"
                whileInView="show"
                key={item.title}
                className="flex w-full flex-col gap-4"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={320}
                  height={150}
                  className="object-cover"
                />

                <div>
                  <h3 className="p-semibold-20">{item.title}</h3>
                  <p className="p-medium-16 text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

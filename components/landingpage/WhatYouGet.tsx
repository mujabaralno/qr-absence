import { whatYouGetList } from "@/constants";
import Image from "next/image";
import React from "react";

import * as motion from "motion/react-client";
import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";

const WhatYouGet = () => {
  return (
    <section className="w-full wrapper grid md:grid-cols-2 grid-cols-1 gap-5 mt-10 ">
      <motion.div 
      variants={staggerContainer(0.5, 0.8)}
      viewport={{ once: true, amount: 0.25 }}
      initial="hidden"
      whileInView="show"
      className="w-full flex flex-col gap-7 max-w-[28rem] ">
        <motion.h2 
        variants={textVariant(0.5)}
        initial="hidden"
        whileInView="show"
        className=" h2-semibold w-full max-w-[20rem]">
          What Benifit Will You Get
        </motion.h2>
        {whatYouGetList.map((item, i) => {
          return (
            <div 
            key={item.label}
            className="flex flex-col gap-2">
              <motion.div
              variants={textVariant(i * 0.3)}
              initial="hidden"
              whileInView="show"
                className="flex flex-row gap-3 items-center"
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  width={27}
                  height={30}
                />
                <p className="p-medium-16 text-gray-400">{item.label}</p>
              </motion.div>
            </div>
          );
        })}
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
            src="/images/whatyouget-photo.png"
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

export default WhatYouGet;

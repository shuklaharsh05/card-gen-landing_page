"use client";
import React, { useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imagePop = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // New variant for Hero-phone sliding in
  const imageSlideIn = {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2, // 0.2s delay after Hero.png
      },
    },
  };

  const textRef = useRef(null);
  const imgRef = useRef(null);

  const textInView = useInView(textRef, { once: true, amount: 0.4 });
  const imgInView = useInView(imgRef, { once: true, amount: 0.4 });

  return (
    <section className="w-full bg-white overflow-hidden py-14 pt-32 md:pt-56 min-h-screen">
      <div className="mx-auto flex flex-col items-center text-center px-6 relative">
        {/* Text Section */}
        <motion.div
          ref={textRef}
          variants={fadeUp}
          initial="hidden"
          animate={textInView ? "visible" : "hidden"}
          className="flex flex-col items-center justify-center space-y-2 md:space-y-5 z-10 poppins-semibold"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl poppins-bold leading-tight text-black">
            Your Entire{" "}
            <span className="bg-gradient-to-r from-[#000000] to-[#004DFF] bg-clip-text text-transparent">
              Profile.
            </span>
            <br /> One Link{" "}
            <span className="bg-gradient-to-r from-[#000000] to-[#004DFF] bg-clip-text text-transparent">
              Away
            </span>
          </h1>

          <p className="text-black font-semibold text-sm sm:text-base md:text-3xl poppins-light max-w-[600px]">
            All information in <span className="font-bold">one link.</span> Get one card.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-10 mt-10">
            <button className="px-5 py-2 md:px-6 mt-2 md:mt-8 md:py-3 border border-[#000000] rounded-[20px] text-sm md:text-base font-medium transition hover:bg-[#2C4AE5] hover:border-white hover:text-white" onClick={() => navigate("/login")}>
              <span className="bg-gradient-to-r from-[#000000] to-[#004DFF] bg-clip-text text-transparent hover:text-white">
                Professional Link
              </span>
            </button>
            <button className="px-8 py-2 md:px-11 md:mt-8 md:py-3 bg-black text-white rounded-[20px] text-sm md:text-base font-medium hover:bg-white hover:text-black border border-black transition" onClick={() => navigate("/login")}>
              Business Link
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mockup Section */}
      <div className="relative flex justify-center items-center mt-12 md:mt-20 w-full py-16 md:py-14 lg:py-44">
        {/* Hero.png */}
        <motion.div
          ref={imgRef}
          variants={imagePop}
          initial="hidden"
          animate={imgInView ? "visible" : "hidden"}
          className="relative w-full"
        >
          <motion.img
            src="/Hero.png"
            alt="Phone Mockup"
            className="w-full z-20 drop-shadow-2xl"
          />
        </motion.div>

        {/* Hero-phone.png */}
        <motion.div
          variants={imageSlideIn}
          initial="hidden"
          animate={imgInView ? "visible" : "hidden"}
          className="absolute w-full -top-12 md:-top-36 lg:-top-10 flex justify-center"
        >
          <motion.img
            src="/Hero-phone.png"
            alt="Phone Mockup"
            className="lg:min-w-[70%] scale-75 md:scale-75 lg:scale-100 mx-auto z-20 drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default memo(Hero);

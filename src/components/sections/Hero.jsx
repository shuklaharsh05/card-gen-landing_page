"use client";
import React from "react";

export default function Hero() {
  return (
    <section className="w-full py-28 lg:py-36 bg-white my-auto">
      {/* Centered container — same width as header */}
      <div className="max-w-[1200px] mx-auto flex flex-col-reverse md:flex-row justify-between items-center gap-10 px-6">
        {/* Left Section */}
        <div className="lg:space-y-8 md:space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl poppins-bold leading-tight text-black">
            One Link.
            <br /> All Connections
          </h1>

          <p className="text-gray-600 lg:leading-relaxed text-xs sm:text-base md:text-base lg:text-lg poppins-light mt-3">
            Choose your link type according to your requirements.
            <br className="hidden lg:block" />
            We provide you with two options to select from personal and
            professional.
          </p>

          <div className="flex flex-row justify-center md:justify-start items-center gap-3 sm:gap-4 mt-5">
            <button className="w-full sm:w-auto lg:px-6 md:px-4 md:py-2 px-2 py-2 text-sm md:text-base border-2 border-black text-black rounded-full font-medium hover:bg-black hover:text-white transition">
              Work Link
            </button>
            <button className="w-full sm:w-auto lg:px-6 md:px-4 md:py-2 px-2 py-2 text-sm md:text-base border-2 border-black bg-black text-white rounded-full font-medium hover:bg-white hover:text-black transition">
              Business Link
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex justify-center md:justify-end">
          <img
            src="/Hero.jpg"
            alt="Hero"
            className="object-contain w-[280px] sm:w-[300px] md:w-[600px] lg:w-[650px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}

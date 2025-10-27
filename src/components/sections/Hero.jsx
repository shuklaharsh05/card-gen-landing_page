"use client";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { FaLink } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="w-[90%] bg-white mx-auto">
      <div className="flex sm:min-h-[70vh] md:min-h-[80vh] lg:h-screen pt-14 flex-col md:flex-row justify-around items-center ">
      {/* Left Section */}
      <div className="lg:space-y-8 md:space-y-6 md:px-10 ">
        <h1 className="md:text-3xl lg:text-5xl poppins-bold leading-tight text-black">
          One Link.
          <br /> All Connections
        </h1>
        <p className="text-gray-600 leading-relaxed md:text-sm lg:text-lg poppins-light ">
          Choose your link type according to your requirements.<br />
          We provide you with two options to select from personal and<br/> professional.
        </p>

        <div className="flex items-center gap-4 ">
          <button className="lg:px-6 md:px-4 md:py-1 lg:py-2 border-2 border-black text-black rounded-full font-medium hover:bg-black hover:text-white transition">
            Personal Link
          </button>
          <button className="lg:px-6 md:px-4 md:py-1 lg:py-2 border-2 border-black bg-black text-white rounded-full font-medium hover:bg-white hover:text-black transition">
            Business Link
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative ">

        {/* Main Image */}
        <img
          src="/Hero.png"
          alt="Hero"
          className="object-contain w-[250px] sm:w-[350px] md:w-[400px] lg:w-[500px] h-auto"
        />

      </div>
      </div>
    </section>
  );
}

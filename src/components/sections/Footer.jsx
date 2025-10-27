import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaLinkedin } from "react-icons/fa";
import { FiExternalLink, FiSearch } from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-black text-white ">
      <div className="max-w-7xl md:py-6 xl:py-10 mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Left Section */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">VisitingLink</h2>
            <FiExternalLink className="text-green-400 text-lg" />
          </div>
          <p className="text-gray-300 mt-3 max-w-sm leading-relaxed">
            Earn More. Enjoy More. Your Benefits,<br /> Delivered with one link
          </p>

          {/* Search bar */}
          <div className="relative mt-5 w-[250px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent border-2 border-white rounded-full py-2 pl-4 pr-10 outline-none text-white placeholder-gray-400"
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-lg" />
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex justify-center gap-16">
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#">Home</a></li>
              <li><a href="#">Benefits</a></li>
              <li><a href="#">Welcome Offer</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">Privacy Policies</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#">Terms And Conditions</a></li>
            </ul>
          </div>
          <div className="flex md:justify-end justify-center items-start gap-4">
            <a href="#" className="rounded-md hover:bg-white/10 transition">
              <FaLinkedin className="text-2xl" />
            </a>
            <a href="#" className="rounded-full hover:bg-white/10 transition">
              <FaWhatsapp className="text-2xl" />
            </a>
            <a href="#" className="rounded-full hover:bg-white/10 transition">
              <FaFacebook className="text-2xl" />
            </a>
            <a href="#" className="rounded-full hover:bg-white/10 transition">
              <FaInstagram className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
      {/* Divider + Copyright */}
      <div className="bg-white border-t border-white/20 md:mt-5 xl:mt-10 md:py-3 xl:py-5 text-center text-md text-black">
        © 2025 Visitinglink. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;

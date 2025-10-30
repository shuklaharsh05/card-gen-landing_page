"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <header
      className={`fixed top-0 w-full bg-white transition-all duration-500 z-50 ${
        scrolled ? "py-2 shadow-md" : "py-4"
      }`}
    >
      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="h-16 object-contain" />
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button className="px-5 py-1.5 bg-white text-black rounded-full font-semibold border border-gray-300 hover:bg-gray-100">
            Prices
          </button>
          {user ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-1.5 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 transition"
              >
                Dashboard
              </button>
              <button
                onClick={signOut}
                className="px-5 py-1.5 bg-gray-700 text-white rounded-full font-semibold hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-1.5 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-1.5 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition"
              >
                Get Your Link
              </button>
            </>
          )}
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-3xl text-black"
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 md:hidden"
          >
            <div className="flex flex-col items-center gap-4 py-5">
              <button
                className="px-5 py-2 bg-white text-black rounded-full font-semibold border border-gray-300 w-4/5 hover:bg-gray-100"
                onClick={() => {
                  navigate("/prices");
                  setMenuOpen(false);
                }}
              >
                Prices
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMenuOpen(false);
                    }}
                    className="px-5 py-2 bg-blue-700 text-white rounded-full font-semibold w-4/5 hover:bg-blue-800 transition"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="px-5 py-2 bg-gray-700 text-white rounded-full font-semibold w-4/5 hover:bg-gray-800 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="px-5 py-2 bg-blue-700 text-white rounded-full font-semibold w-4/5 hover:bg-blue-800 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMenuOpen(false);
                    }}
                    className="px-5 py-2 bg-black text-white rounded-full font-semibold w-4/5 hover:bg-gray-900 transition"
                  >
                    Get Your Link
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;

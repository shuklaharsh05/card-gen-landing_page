import React, { useState, useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // If user scrolled down more than 5px, set to true
      setScrolled(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 w-full bg-white flex justify-between lg:px-20 transition-all duration-500 z-50 ${
        scrolled ? "py-2 shadow-md" : "py-4"
      }`}
    >
      <div className="flex p-4 justify-center items-center gap-2">
        <h1 className="lg:text-2xl md:text-xl font-bold text-black">Visiting Link</h1>
        <FiExternalLink className="text-blue-700 lg:text-2xl md:text-xl" />
      </div>
      <div>
        <button className="m-4 px-6 py-1.5 bg-white text-black rounded-full font-bold">
          Prices
        </button>
        {user ? (
          <>
            <button 
              onClick={() => navigate('/dashboard')}
              className="m-4 px-6 py-1.5 bg-blue-700 text-white rounded-full"
            >
              Dashboard
            </button>
            <button 
              onClick={signOut}
              className="m-4 px-6 py-1.5 bg-gray-600 text-white rounded-full"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate('/login')}
              className="m-4 px-6 py-1.5 bg-blue-700 text-white rounded-full"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="m-4 px-6 py-1.5 bg-black text-white rounded-full"
            >
              Get Your Link
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;

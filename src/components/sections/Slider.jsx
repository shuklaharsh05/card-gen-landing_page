import React from "react";

function Slider() {
  return (
    <div className="w-full bg-white mx-auto flex flex-col justify-around items-center gap-10 py-14 md:gap-20 md:py-20 md:px-6 xl:px-20">
      {/* Top Image Slider */}
      <div className="w-full flex justify-start md:justify-around items-center overflow-x-auto gap-4 px-4 md:px-0 scrollbar-hide">
        {/* Images scroll horizontally on mobile */}
        {[
          "/slider-1.png",
          "/slider-2.png",
          "/slider-3.png",
          "/slider-4.png",
          "/slider-5.png",
          "/slider-6.png",
        ].map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`slider-${i + 1}`}
            className="w-32 h-auto sm:w-40 md:w-auto flex-shrink-0 object-contain"
          />
        ))}
      </div>

      {/* Stats Section */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-4 md:gap-4 xl:gap-14 px-6 md:px-0">
        {/* 1 */}
        <div className="flex flex-col items-center justify-around bg-[#1313c922] rounded-2xl p-5 md:p-6 xl:p-4">
          <div className="w-full h-24 flex justify-center items-center">
            <img
              src="/1.png"
              alt="stat-1"
              className="object-contain w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mt-2">
            1200+
          </h1>
          <p className="text-sm text-gray-700 text-center">
            Trusted Businesses Profile
          </p>
        </div>

        {/* 2 */}
        <div className="flex flex-col items-center justify-around bg-[#1313c922] rounded-2xl p-5 md:p-6 xl:p-4">
          <div className="w-full h-24 flex justify-center items-center">
            <img
              src="/2.png"
              alt="stat-2"
              className="object-contain w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mt-2">
            5k+
          </h1>
          <p className="text-sm text-gray-700 text-center">
            Personal Profiles
          </p>
        </div>

        {/* 3 */}
        <div className="flex flex-col items-center justify-around bg-[#1313c922] rounded-2xl p-5 md:p-6 xl:p-4">
          <div className="w-full h-24 flex justify-center items-center">
            <img
              src="/3.png"
              alt="stat-3"
              className="object-contain w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mt-2">
            4.9 <span className="text-blue-500">★</span> Rated
          </h1>
          <p className="text-sm text-gray-700 text-center">
            Trusted Businesses Profile
          </p>
        </div>

        {/* 4 */}
        <div className="flex flex-col items-center justify-around bg-[#1313c922] rounded-2xl p-5 md:p-6 xl:p-4">
          <div className="w-full h-24 flex justify-center items-center">
            <img
              src="/4.png"
              alt="stat-4"
              className="object-contain w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mt-2">
            200+ Corporate
          </h1>
          <p className="text-sm text-gray-700 text-center">
            Corporate Bulk Profiles
          </p>
        </div>
      </div>
    </div>
  );
}

export default Slider;

import React from "react";
import bannerBg from "/banner.png";
import bannerLeft from "/banner-img-left.png";
import bannerRight from "/banner-img-right.png";

function Banner() {
  return (
    <div className="w-full bg-[#0040FF] flex justify-center items-center">
      {/* Central container */}
      <div
        className="w-[90%] md:w-full flex justify-center items-center gap-6 bg-cover bg-center rounded-2xl overflow-hidden"
      >
        {/* Left Side */}
        <div className="w-[60%] flex bg-contain bg-left bg-no-repeat lg:pl-12 md:pl-8 pr-16 md:pr-0"
                style={{
          backgroundImage: `url(${bannerBg})`,
        }}
        >
          <img
            src={bannerLeft}
            alt="Banner Left"
            className="w-[300px] lg:w-[400px] xl:w-[500px] object-contain drop-shadow-xl"
          />
        </div>

        {/* Right Side */}
        <div className="flex justify-center items-center">
          <img
            src={bannerRight}
            alt="Banner Right"
            className="w-[100px] md:w-[150px] lg:w-[250px] xl:w-[300px] object-contain opacity-90"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;

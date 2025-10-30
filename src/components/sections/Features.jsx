import React from "react";

function Features() {
  const feature = [
    {
      image: "/feature-1.png",
      title: "One Link",
      description: "Create a comprehensive one-link solution.",
    },
    {
      image: "/feature-2.png",
      title: "Easy Share",
      description: "Effortless Sharing Accessible to Everyone",
    },
    {
      image: "/feature-3.png",
      title: "Appointment",
      description: "Easy Scheduling for All with Appointment Software",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-0 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left mb-10 md:mb-12 lg:mb-16">
        Features
      </h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-16">
        {feature.map((item, index) => (
          <div
            key={index}
            className="bg-[#1313C914] rounded-3xl py-6 lg:p-6 md:p-3 sm:p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-md"
          >
            {/* Feature Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 md:mb-4 sm:mb-6">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Feature Title */}
            <h3 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-4">
              {item.title}
            </h3>

            {/* Feature Description */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xs">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;

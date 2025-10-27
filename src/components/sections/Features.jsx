import React from 'react'

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
  ]

  return (
    <section className="max-w-7xl mx-auto w-full md:py-10 lg:py-20 md:px-10 lg:px-0">
      {/* Header */}
      <h2 className="md:text-3xl lg:text-4xl xl:text-5xl font-bold text-left lg:mb-16 md:mb-6 ml-6">
        Features
      </h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 lg:gap-16 max-px-10">
        {feature.map((item, index) => (
          <div
            key={index}
            className="bg-[#1313C914] rounded-3xl p-8 flex flex-col items-center text-center transition-transform hover:scale-105"
          >
            {/* Feature Icon */}
            <div className="md:w-20 lg:w-24 md:h-16 lg:h-24 mb-6">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Feature Title */}
            <h3 className="md:text-lg lg:text-2xl font-bold mb-4">{item.title}</h3>

            {/* Feature Description */}
            <p className="text-gray-600 md:text-sm lg:text-md leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
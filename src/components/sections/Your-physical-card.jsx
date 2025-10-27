import React from "react";

function YourPhysicalCard() {
  return (
    <section className="w-full pt-16 bg-white">
      {/* Heading */}
      <h1 className="text-center font-bold text-4xl text-black">
        Your Physical Card
      </h1>
      <p className="max-w-md mx-auto text-md text-center text-gray-600 py-4">
        Select your preferred card type to order and enjoy the benefits of an
        NFC-enabled card.
      </p>

      {/* Cards Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 lg:gap-20 md:pt-32 xl:pt-40 px-6 relative">
        {/* Metal Card */}
        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-md w-full max-w-sm max-h-[400px] flex flex-col items-center justify-end text-center p-8 overflow-visible">
          {/* Card Image */}
          <img
            src="/card-1.png"
            alt="Metal Card"
            className="absolute -top-1/4 left-1/2 -translate-x-1/2 md:w-[250px] xl:w-[300px] drop-shadow-lg scale-150 transition-transform duration-300"
          />

          {/* Text Section */}
          <div className="lg:mt-28 md:mt-20">
            <h2 className="text-2xl font-bold text-black">Metal Card</h2>
            <div className="w-16 h-[2px] mx-auto my-6 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <p className="text-gray-600 text-sm leading-relaxed px-2">
              Select your preferred card type to order and enjoy the benefits of
              an NFC-enabled card.
            </p>

            {/* Button */}
            <button className="mt-6 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition duration-200">
              Get Card
            </button>
          </div>
        </div>

        {/* PVC Card */}
        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-md w-full max-w-sm max-h-[400px] flex flex-col items-center justify-end text-center p-8 overflow-visible">
          {/* Card Image */}
          <img
            src="/card-2.png"
            alt="PVC Card"
            className="absolute -top-1/4 left-1/2 -translate-x-1/2 md:w-[250px] xl:w-[300px] drop-shadow-lg scale-150 transition-transform duration-300"
          />

          {/* Text Section */}
          <div className="lg:mt-28 md:mt-20">
            <h2 className="text-2xl font-bold text-black">PVC card</h2>
            <div className="w-16 h-[2px] mx-auto my-6 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <p className="text-gray-600 text-sm leading-relaxed px-2">
              A PVC card equipped with NFC technology that lets you tap and
              share your details effortlessly.
            </p>

            {/* Button */}
            <button className="mt-6 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition duration-200">
              Get Card
            </button>
          </div>
        </div>
      </div>

      {/* Footer image */}
      <div>
        <img
          src="/buildings.png"
          alt="buildings"
          className="w-full mt-12 -mb-20 object-cover"
        />
      </div>
    </section>
  );
}

export default YourPhysicalCard;

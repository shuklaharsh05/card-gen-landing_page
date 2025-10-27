import React from 'react'

function CustomTemplate() {
  return (
    <div>
      <h1 className='text-4xl text-center font-bold text-[#635d5d]'>
        Custom Design Template
      </h1>

      <div className='py-4 flex justify-around items-center w-full'>
        {/* Left pin (transparent placeholder for layout balance) */}
        <div>
          <img
            src="/pin.png"
            alt="pin"
            className='mx-auto h-full object-cover py-8 opacity-0 select-none'
          />
        </div>

        {/* Center text block */}
        <div>
          <p className='text-md text-center my-3 max-w-xl'>
            Showcase everything you do with one smart link — your business, socials,
            services, and contact in one place
          </p>
          <h3 className='text-xl text-center font-bold text-[#635d5d]'>
            # Your Identity, One Tap Away
          </h3>
        </div>

        {/* Right pin (visible) */}
        <div>
          <img
            src="/pin.png"
            alt="pin"
            className='mx-auto h-full object-cover py-8'
          />
        </div>
      </div>

      <img
        src="/custom-template.png"
        alt="custom-template"
        className='max-w-xs md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto h-full object-cover'
      />
    </div>
  )
}

export default CustomTemplate

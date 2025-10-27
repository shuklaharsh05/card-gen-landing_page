import React from 'react'

function Slider() {
  return (
    <div className='w-full bg-white mx-auto flex flex-col justify-around items-center gap-20 py-20 md:px-6 xl:px-20'>
        <div className='w-full flex justify-around items-center'>
            <img src="/slider-1.png" alt="slider-1" />
            <img src="/slider-2.png" alt="slider-1" />
            <img src="/slider-3.png" alt="slider-1" />
            <img src="/slider-4.png" alt="slider-1" />
            <img src="/slider-5.png" alt="slider-1" />
            <img src="/slider-6.png" alt="slider-1" />
        </div>
        <div className='w-full grid lg:grid-cols-4 md:grid-cols-2 max-w-7xl mx-auto md:gap-4 xl:gap-14'>
            <div className='flex flex-col items-center justify-around bg-[#1313c922] rounded-2xl md:p-6 xl:p-4'>
                <div className='w-full h-20 md:h-24 lg:h-36 xl:h-44 flex justify-center items-center'>
                  <img src="/1.png" alt="slider-1" />
                </div>
                <h1 className='text-md md:text-lg lg:text-xl xl:text-2xl font-medium xl:font-semibold text-center md:mt-10 lg:mt-4'>1200+</h1>
                <p className='text-xs md:text-sm xl:text-md text-gray-700 text-center lg:mb-4'>Trusted Businesses Profile</p>
            </div>
            <div className='flex flex-col items-center justify-around bg-[#1313c922] rounded-2xl md:p-6 xl:p-4'>
                <div className='w-full h-20 md:h-24 lg:h-36 xl:h-44 flex justify-center items-center'>
                  <img src="/2.png" alt="slider-1" />
                </div>
                <h1 className='text-md md:text-lg lg:text-xl xl:text-2xl font-medium xl:font-semibold text-center md:mt-10 lg:mt-4'>5k+</h1>
                <p className='text-xs md:text-sm xl:text-md text-gray-700 text-center lg:mb-4'>Personal Profiles</p>
            </div>
            <div className='flex flex-col items-center justify-around bg-[#1313c922] rounded-2xl md:p-10 xl:p-4'>
                <div className='w-full h-20 md:h-24 lg:h-36 xl:h-44 flex justify-center items-center'>
                  <img src="/3.png" alt="slider-1" />
                </div>
                <h1 className='text-md md:text-lg lg:text-xl xl:text-2xl font-medium xl:font-semibold text-center md:mt-10 lg:mt-4'>4.9 <span className='text-blue-500'>★</span> Rated</h1>
                <p className='text-xs md:text-sm xl:text-md text-gray-700 text-center lg:mb-4'>Trusted Businesses Profile</p>
            </div>
            <div className='flex flex-col items-center justify-around bg-[#1313c922] rounded-2xl md:p-6 xl:p-4'>
                <div className='w-full h-20 md:h-24 lg:h-36 xl:h-44 flex justify-center items-center'>
                  <img src="/4.png" alt="slider-1" />
                </div>
                <h1 className='text-md md:text-lg lg:text-xl xl:text-2xl font-medium xl:font-semibold text-center md:mt-10 lg:mt-4 text-nowrap'>200+ Corporate</h1>
                <p className='text-xs md:text-sm xl:text-md text-gray-700 text-center lg:mb-4'>Corporate Bulk Profiles</p>
            </div>

        </div>
    </div>
  )
}

export default Slider
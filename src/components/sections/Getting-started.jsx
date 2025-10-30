import React from 'react'

function Gettingstarted() {
  return (
    <div className='w-full bg-white mx-auto flex flex-col justify-around items-center gap-20 pb-20'>
        <div className='grid grid-cols-1 max-w-[80%] md:grid-cols-3 gap-10 md:gap-2 lg:gap-4 md:max-w-3xl lg:max-w-7xl mx-auto py-10 lg:py-32'>
            <div className='flex items-center gap-8 md:gap-4 md:p-3 lg:p-0'>
                <img src="/1.svg" alt="getting-started-1" className='h-24 lg:h-36' />
                <div className='flex flex-col gap-2'>
                    <h1 className='text-lg md:text-2xl lg:text-3xl font-semibold text-[#004aad]'>Fillup Form</h1>
                    <p className='text-sm md:text-md lg:text-lg'>Fill Up the form to initiate the profile creation process.</p>
                </div>
            </div>
            <div className='flex items-center gap-8 md:gap-4 md:p-3 lg:p-4'>
                <img src="/2.svg" alt="getting-started-1" className='h-24 lg:h-36' />
                <div className='flex flex-col gap-2'>
                    <h1 className='text-lg md:text-2xl lg:text-3xl font-semibold text-[#004aad]'>Fillup Form</h1>
                    <p className='text-sm md:text-md lg:text-lg'>Fill Up the form to initiate the profile creation process.</p>
                </div>
            </div>
            <div className='flex items-center gap-8 md:gap-4 md:p-3 lg:p-4'>
                <img src="/3.svg" alt="getting-started-1" className='h-24 lg:h-36' />
                <div className='flex flex-col gap-2'>
                    <h1 className='text-lg md:text-2xl lg:text-3xl font-semibold text-[#004aad]'>Fillup Form</h1>
                    <p className='text-sm md:text-md lg:text-lg'>Fill Up the form to initiate the profile creation process.</p>
                </div>
            </div>
        </div>




        <div className='flex lg:flex-row flex-col max-w-7xl mx-auto gap-8 justify-around'>

            <div className='w-[90%] mx-auto lg:w-[60%] flex justify-center lg:justify-around items-center bg-gray-200 rounded-xl md:rounded-3xl overflow-hidden md:overflow-visible'>
                <div className='w-full md:w-[60%] space-y-4 pl-4 py-4 md:space-y-10 md:my-auto md:pl-12 md:pr-6'>
                  <div className='md:gap-5 gap-2 flex flex-col'>
                    <h3 className='text-lg md:text-3xl lg:text-4xl xl:text-4xl leading-[1.2] md:leading-[1.5] font-bold'>
                    Get One Link For your Business Profile
                    </h3>
                    <p className='text-sm md:text-md xl:text-lg md:leading-[1.5] '>A universal QR code solution for appointment software, perfect for Business to efficiently schedule all online meetings.</p>

                  </div>  
                    <div className=''>
                    <a href="/" className='bg-black text-white px-6 py-2 rounded-2xl text-sm md:text-xl poppins-semibold'>Bussiness Link</a> 
                    </div>
                </div>
                <div className='max md:max-w-60 md:mr-20'>
                    <div className='relative xl:-top-[37px] md:-top-[18px] lg:top-[20px] top-[7px]'>
                    <img src="/person.png" alt="your-physical-card" className='scale-100 md:scale-110 lg:scale-125' />
                    </div>
                </div>
            </div>

            <div className='w-[90%] mx-auto lg:w-[30%] flex flex-row-reverse md:flex-col items-center justify-center gap-8 md:gap-4 bg-gray-200 p-6 md:p-8 rounded-xl md:rounded-3xl'>
            <img src="/qr.png" alt="your-physical-card" className='md:max-w-44 md:w-full w-20' />
            <p className='md:text-center text-sm md:text-md xl:text-lg md:mt-6'>QR code for appointment software allows businesses to manage and share details efficiently through a single profile or link</p>
            </div>
        </div>
    </div>
  )
}

export default Gettingstarted
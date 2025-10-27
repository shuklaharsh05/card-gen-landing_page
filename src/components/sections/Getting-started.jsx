import React from 'react'

function Gettingstarted() {
  return (
    <div className='w-full bg-white mx-auto flex flex-col justify-around items-center gap-20 md:pb-20'>
        <div className='grid grid-cols-3 md:gap-2 lg:gap-4 lg:max-w-7xl mx-auto py-10'>
            <div className='flex items-center gap-4 md:p-2 lg:p-4'>
                <img src="/1.svg" alt="getting-started-1" />
                <div className='flex flex-col gap-2'>
                    <h1 className='md:text-lg lg:text-2xl font-semibold text-[#004aad]'>Fillup Form</h1>
                    <p className=''>Fill Up the form to initiate the profile creation process.</p>
                </div>
            </div>
            <div className='flex items-center gap-4 md:p-2 lg:p-4'>
                <img src="/2.svg" alt="getting-started-1" />
                <div className='flex flex-col gap-2'>
                    <h1 className='md:text-lg lg:text-2xl font-semibold text-[#004aad]'>Fillup Form</h1>
                    <p className=''>Fill Up the form to initiate the profile creation process.</p>
                </div>
            </div>
            <div className='flex items-center gap-4 md:p-2 lg:p-4'>
                <img src="/3.svg" alt="getting-started-1" />
                <div className='flex flex-col gap-2'>
                    <h1 className='md:text-lg lg:text-2xl font-semibold text-[#004aad]'>Fillup Form</h1>
                    <p className=''>Fill Up the form to initiate the profile creation process.</p>
                </div>
            </div>
        </div>




        <div className='flex lg:flex-row md:flex-col max-w-6xl mx-auto px-10 gap-8 justify-around'>
            <div className='w-full lg:w-[60%] flex justify-around bg-gray-200 rounded-lg'>
                <div className='w-full md:w-[60%] md:my-auto md:pl-12 pr-6'>
                    <h3 className='md:text-3xl lg:text-2xl xl:text-4xl leading-[1.1] font-bold'>
                    Get One Link For your Business Profile
                    </h3>
                    <p className='md:text-md xl:text-lg leading-[1.35] mt-2 mb-6'>A universal QR code solution for appointment software, perfect for Business to efficiently schedule all online meetings.</p>

                    <div className=''>
                    <a href="/" className='bg-black text-white px-4 pt-2 pb-3 rounded-2xl'>Bussiness Link</a> 
                    </div>
                </div>
                <div className='max-w-60 mr-10'>
                    <div className='relative xl:-top-[17px] md:-top-[17px] lg:top-[6px]'>
                    <img src="/person.png" alt="your-physical-card" className='scale-110' />
                    </div>
                </div>
            </div>

            <div className='w-full lg:w-[30%] flex flex-col items-center justify-center gap-4 bg-gray-200 p-8 rounded-lg'>
            <img src="/qr.png" alt="your-physical-card" className='max-w-44 w-full' />
            <p className='text-center mt-6'>QR code for appointment software allows businesses to manage and share details efficiently through a single profile or link</p>
            </div>
        </div>
    </div>
  )
}

export default Gettingstarted
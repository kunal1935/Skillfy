import React from 'react'

export const Companies = () => {
  return (
    <div className='pt-16'>
      <p className='text-base  text-gray-500'>
        Trusted by  learners from 
      </p>
      <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5'>
        <img src="/src/assets/microsoft_logo.svg" alt="Microsoft" className='w-20 md:w-28' />
        <img src="/src/assets/walmart_logo.svg" alt="Walmart" className='w-20 md:w-28' />
        <img src="/src/assets/accenture_logo.svg" alt="Accenture" className='w-20 md:w-28' />
        <img src="/src/assets/adobe_logo.svg" alt="Adode" className='w-20 md:w-28' />
        <img src="/src/assets/paypal_logo.svg" alt="Paypal" className='w-20 md:w-28' />

      </div>
    </div>
  )
}

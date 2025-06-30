import { TriangleAlert } from 'lucide-react'
import React from 'react'

const NoData = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center gap-y-2 rounded-xl bg-white'>
      <TriangleAlert className='size-12 md:size-16 lg:size-20' />
      <p className='text-base md:text-lg font-medium'>No data to show</p>
    </div>
  )
}

export default NoData
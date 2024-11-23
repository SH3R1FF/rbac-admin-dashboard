import { ConfettiFireworks } from '@/components/fireworks'
import Particles from '@/components/ui/particles'
import Link from 'next/link'
import React from 'react'

const ThanksPage = () => {
  return (
    <div className='container mx-auto h-[40vh] w-full flex items-center justify-center'>
        <div className='flex flex-col items-center gap-10'>
            <Link href={"/"} className='text-blue-500 hover:text-blue-700 underline underline-offset-4'> Back to Dashboard</Link>
            <ConfettiFireworks/>
        </div>
        <Particles
            className="absolute inset-0"
            quantity={100}
            ease={300}
            refresh
      />
    </div>
    
  )
}

export default ThanksPage
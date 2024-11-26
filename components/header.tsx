import React from 'react'
import { ModeToggle } from './modeChange'
import Image from 'next/image'
import logo from "@/public/logo.svg"

const Header = () => {
  return (
    <div className='w-full dark:bg-neutral-900 bg-neutral-50 border-b'>
        <div className='flex items-center justify-between p-4 container mx-auto'>
            <div className='flex items-center gap-2 dark:bg-neutral-800 bg-slate-100 p-2 rounded-lg'>
                <Image src={logo} alt='logo' width={30} height={30}/>
                <p className='font-bold '>
                    DASHBOARD
                </p>
            </div>

            {/* For Switching Themes */}

            <div>
                <ModeToggle/>
            </div>

        </div>
    </div>
  )
}

export default Header
'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { RiCloseLargeLine } from 'react-icons/ri'
import { usePathname } from 'next/navigation'
import '../../app/globals.css'
import Image from 'next/image'

const Header = () => {
    const pathname = usePathname() // Get the current path dynamically
    const [toggle, setToggle] = useState(false)
    const [componentMount, setComponentMount] = useState(false)

    const handleToggle = () => {
        setToggle(!toggle) // Toggle between showing and hiding the navbar
        if (!componentMount) {
            setComponentMount(true) // Set componentMount to true when toggle is first triggered
        }
    }

    const navLinks = [
        { title: 'Home', link: '/' },
        { title: 'About', link: '/about' },
        { title: 'Chronology', link: '/chronology' },
        { title: 'Family Tree', link: '/family-tree' },
        { title: 'Photos', link: '/photos' },
    ]
    return (
        <div className="flex font-inter header sticky top-0 w-full z-[50] justify-center  items-center h-[100px] ">
            {/* links */}
            <div className="rounded-md w-1/2 hidden lg:flex justify-center p-[2px] gap-8 ">
                {navLinks.map((link, index) => (
                    <Link
                        href={link.link}
                        key={index}
                        className={` capitalize text-center  ${
                            pathname === link.link
                                ? 'text-brown-gradient underline'
                                : 'text-foreground'
                        }`}
                    >
                        {link.title}
                    </Link>
                ))}
            </div>

            {/* RESPONSIVENESS */}

            {/* {toggle && (
                <div className="fixed inset-0 bg-black md:bg-opacity-50 bg-opacity-30"></div>
            )} */}

            <span
                className="absolute right-[2rem] lg:hidden"
                onClick={handleToggle}
            >
                {toggle ? (
                    <RiCloseLargeLine size={27} className="text-appBrown" />
                ) : (
                    <Image
                        width={32}
                        height={32}
                        src="/images/home/Menu.svg"
                        alt="main tree "
                    />
                )}
            </span>
            {/*  */}
            <div
                className={`flex flex-col ${
                    !componentMount && !toggle
                        ? 'hidden'
                        : toggle && componentMount
                        ? 'slide-in-left'
                        : 'slide-out-left'
                } items-start justify-start glass-background opacity-50 top-0 bg-foreground text-appBrown2 absolute py-[38px] px-[20px] left-0  z-10 w-[65%] md:w-[45%] h-dvh nav shadow-lg transition-all duration-300 gap-4 lg:hidden`}
            >
                <div className="h-[50px]"></div>
                {navLinks.map((link, index) => (
                    <Link
                        href={link.link}
                        key={index}
                        onClick={handleToggle}
                        className={`my-[5px] capitalize text-center ${
                            pathname === link.link
                                ? 'text-brown-gradient underline '
                                : 'text-appBrown'
                        }`}
                    >
                        {link.title}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Header

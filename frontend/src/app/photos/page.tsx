'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io'
import { LuSearch } from 'react-icons/lu'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const Photos = () => {
    const [activeButton, setActiveButton] = useState('All-Photos')

    return (
        <section className="min-h-screen">
            {/* HEADER SECTION */}
            <div className="flex justify-center">
                <div className="lg:w-1/2 w-full flex flex-col items-center gap-2">
                    {/* header */}
                    <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
                        Family photo Gallery
                    </h2>

                    <div className="flex gap-3 justify-center items-center">
                        <button
                            onClick={() => setActiveButton('All-Photos')}
                            className={`md:rounded-[12px] rounded-[12px] ${
                                activeButton === 'All-Photos'
                                    ? 'button-home text-white transition-all duration-100'
                                    : 'bg-transparent border-[1px] border-appBrown2 text-appBrown2'
                            } mt-[1rem]  md:text-[15px] text-[13px] md:px-3 px-4 md:py-3 py-2 min-w-[150px] flex justify-center items-center `}
                        >
                            All photos
                        </button>
                        <button
                            onClick={() => setActiveButton('Historical')}
                            className={`md:rounded-[12px] rounded-[12px] ${
                                activeButton === 'Historical'
                                    ? 'button-home text-white transition-all duration-100'
                                    : 'bg-transparent border-[1px] border-appBrown2 text-appBrown2'
                            } mt-[1rem]  md:text-[15px] text-[13px] md:px-3 px-4 md:py-3 py-2 min-w-[200px] flex justify-center items-center transition-all duration-200`}
                        >
                            Historical
                        </button>
                        <button
                            onClick={() => setActiveButton('Recent-Events')}
                            className={`md:rounded-[12px] rounded-[12px] ${
                                activeButton === 'Recent-Events'
                                    ? 'button-home text-white transition-all duration-100'
                                    : 'bg-transparent border-[1px] border-appBrown2 text-appBrown2'
                            } mt-[1rem]  md:text-[15px] text-[13px] md:px-3 px-4 md:py-3 py-2 min-w-[200px] flex justify-center items-center transition-all duration-200`}
                        >
                            Recent Events
                        </button>
                    </div>

                    <div className="rounded-[16px] mt-[1.5rem] border-[2px] border-appBrown2 px-[2rem] py-3 w-full flex gap-2">
                        <LuSearch size={22} className="text-appBrown2" />
                        <input
                            placeholder="Search"
                            className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown2"
                        />
                    </div>
                </div>
            </div>

            {/* PHOTOS COLLAGE */}
            <div className="grid px-[3rem] my-[4rem] grid-cols-5  gap-[2.5rem]">
                {/* large image */}
                <div className="rounded-[29px] col-span-2 shadow-xl bg-[#FDEBDD] overflow-hidden">
                    <div className="h-[400px] w-full">
                        <Image
                            width={400}
                            height={400}
                            src="/images/photos/family.png"
                            alt="family pictures "
                            className=" w-full h-full object-cover object-top"
                        />
                    </div>

                    <div className="py-[1rem] px-[1rem]">
                        <p className="text-appBrown2 font-medium">
                            Sir Dennis, Sir Bartholomew. Ichie Ezeibunandu,
                            Chief Benjamin with Omile wives
                        </p>
                    </div>
                </div>

                {/* scroll image */}
                <div className="col-span-3 flex flex-col mt-[8%] h-full">
                    {/* Photos Container */}
                    <div className="carousel-wrapper relative">
                        {/* Swiper container */}
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={20} // Space between slides
                            slidesPerView={3} // Adjust slides visible
                            navigation={{
                                prevEl: '.custom-prev',
                                nextEl: '.custom-next',
                            }}
                            className="mySwiper"
                        >
                            {/* Swiper slides */}
                            {[...Array(4)].map((_, index) => (
                                <SwiperSlide key={index}>
                                    <div className="rounded-[29px] shadow-xl bg-[#FDEBDD] overflow-hidden">
                                        <div className="h-[300px] w-full">
                                            <Image
                                                width={300}
                                                height={300}
                                                src={`/images/photos/family${
                                                    index % 2 === 0 ? 2 : ''
                                                }.png`}
                                                alt="family pictures"
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Scroll Buttons */}
                    <div className="w-full gap-3 flex flex-col justify-center items-center mt-[2.5rem]">
                        <div className="rounded-[33px] w-[150px] bg-[#FDEBDD] border-[1px] border-appBrown2 px-[0.7rem] py-[0.5rem] flex justify-between items-center">
                            <button className="custom-prev ">
                                <IoIosArrowRoundBack
                                    size={19}
                                    className="text-appBrown"
                                />
                            </button>
                            <button className="custom-next ">
                                <IoIosArrowRoundForward
                                    size={19}
                                    className="text-appBrown"
                                />
                            </button>
                        </div>
                        <p className="text-appBrown2 font-medium">
                            Scroll to explore
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Photos

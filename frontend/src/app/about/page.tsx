import Image from 'next/image'
import React from 'react'

const About = () => {
    return (
        <section className="min-h-screen">
            {/* HEADER SECTION */}
            <div className="flex justify-center">
                <div className="lg:w-1/2 px-[1.5rem] w-full flex flex-col items-center gap-2">
                    {/* header */}
                    <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
                        Genealogy of Omile Family
                    </h2>

                    <div className="grid mt-[1rem] md:grid-cols-2 grid-cols-1 gap-[1.5rem] md:gap-3">
                        <div>
                            <p className="md:text-[14px] text-appBrown2 text-[12px] ">
                                Nimo, situated in Nikoka Local Government Area
                                of Anambra State, comprises four quarters:
                                Ifitenu, Ifiteani, Etiti Nimo, and Egbengwu
                                Ojideleke. Our heritage begins in
                                Egbengwu&apos;s Umudunu region, founded by Dunu
                                and his three sons: Ogige, Duomeke, and Ogbeagu.
                            </p>
                        </div>
                        <div>
                            <p className="md:text-[14px] mt-0 md:mt-[5rem] text-appBrown2 text-[12px] ">
                                Through generations of marriages and births, the
                                family expanded significantly, with notable
                                branches including the Omile family, descended
                                from Okonkwo Ndichie, who had seven children who
                                further expanded the family through marriages
                                and successive generations. Today, we preserve
                                this rich history while building
                                toward our future.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-[3rem] md:mt-7">
                <div className="hidden md:block">
                    <Image
                        width={1000}
                        height={1000}
                        src="/images/about/Frame 77.png"
                        alt="about "
                    />
                </div>
                <div className="md:hidden">
                    <Image
                        width={1000}
                        height={1000}
                        src="/images/about/Frame 771.png"
                        alt="about "
                    />
                </div>
            </div>
        </section>
    )
}

export default About

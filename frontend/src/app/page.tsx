'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
    return (
        <section className="relative">
            {/* HEADER SECTION */}
            <div className="flex justify-center">
                <div className="lg:w-1/2 w-full flex flex-col items-center gap-2">
                    {/* header */}
                    <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
                        Tracing Our Roots: The Omile Family Heritage.
                    </h2>

                    <p className="md:text-[17px] text-[14px] w-[90%] md:w-[80%] text-center">
                        Seven generations of legacy, unity, and tradition
                        spanning across decades of Nigerian family history
                    </p>

                    <Link href="/family-tree">
                        <button className="md:rounded-[16px] rounded-[6px] button-home mt-[1rem] text-white md:text-[15px] text-[13px] md:px-8 px-4 md:py-4 py-2 flex justify-center items-center">
                            Explore our family tree
                        </button>
                    </Link>
                </div>
            </div>

            {/* tree section */}
            {/* main tree large screen */}
            <div className="hidden md:block mt-[3rem]">
                {/* tree image container */}
                <div className="flex  justify-center">
                    <div className=" relative ">
                        <Image
                            width={663}
                            height={817}
                            src="/images/home/Group 31.png"
                            alt="main tree "
                        />

                        {/* first image */}
                        {/* <div className="absolute border-appBrown2 border-[2px] flex justify-center items-center top-0 h-[60px] w-[60px] left-[50%] rounded-full  overflow-hidden">
                            <Image
                                width={60} 
                                height={60}
                                src="/images/home/test.jpg"
                                alt="main tree"
                                className="w-full h-full object-cover"
                            />
                        </div> */}

                        {/* second line, image left */}
                        {/* <div className="absolute border-appBrown2 border-[2px] flex justify-center items-center top-[25%] h-[60px] w-[60px] left-[11%] rounded-full  overflow-hidden">
                            <Image
                                width={60} 
                                height={60}
                                src="/images/home/test.jpg"
                                alt="main tree"
                                className="w-full h-full object-cover"
                            />
                        </div> */}

                        {/* second line, image right */}
                        {/* <div className="absolute border-appBrown2 border-[2px] flex justify-center items-center top-[25%] h-[60px] w-[60px] right-[11%] rounded-full  overflow-hidden">
                            <Image
                                width={60} 
                                height={60}
                                src="/images/home/test.jpg"
                                alt="main tree"
                                className="w-full h-full object-cover"
                            />
                        </div> */}
                    </div>
                </div>
            </div>

            {/* main screen small screen */}
            <div className=" md:hidden mt-[10rem]">
                {/* tree image container */}
                <div className="flex  justify-center">
                    <div className="p-[2rem] relative ">
                        <Image
                            width={663}
                            height={817}
                            src="/images/home/main-tree-small-screen.png"
                            alt="main tree "
                        />
                    </div>
                </div>
            </div>

            {/* two branches */}
            <div className="absolute md:hidden top-[25%] left-0">
                <Image
                    width={150}
                    height={179}
                    src="/images/home/small-screen-palm-left.png"
                    alt="main tree "
                />
            </div>
            <div className="absolute md:hidden top-[25%] right-0">
                <Image
                    width={150}
                    height={179}
                    src="/images/home/small-screen-palm-right.png"
                    alt="main tree "
                />
            </div>
        </section>
    )
}

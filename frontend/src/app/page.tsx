import Image from 'next/image';
import Link from 'next/link';

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
                        spanning across decades of Omile family history.
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
                <div className="flex justify-center">
                    <div className="relative">
                        <Image
                            width={663}
                            height={817}
                            src="/images/home/Group 31.png"
                            alt="main tree "
                        />
                    </div>
                </div>
            </div>

            {/* main screen small screen */}
            <div className="md:hidden mt-[10rem]">
                <div className="flex justify-center">
                    <div className="p-[2rem] relative">
                        <Image
                            width={663}
                            height={817}
                            src="/images/home/main-tree-small-screen.png"
                            alt="main tree "
                        />
                    </div>
                </div>
            </div>

            {/* two branches with animation */}
            <div className="absolute md:hidden top-[25%] left-0 palm">
                <Image
                    width={150}
                    height={179}
                    src="/images/home/small-screen-palm-left.png"
                    alt="main tree "
                />
            </div>
            <div className="absolute md:hidden top-[25%] right-0 palm">
                <Image
                    width={150}
                    height={179}
                    src="/images/home/small-screen-palm-right.png"
                    alt="main tree "
                />
            </div>

            <style jsx>{`
                @keyframes sway {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(2deg); }
                    50% { transform: rotate(0deg); }
                    75% { transform: rotate(-2deg); }
                    100% { transform: rotate(0deg); }
                }
                .palm {
                    width: 150px;
                    position: absolute;
                    animation: sway 3s ease-in-out infinite;
                    transform-origin: top center;
                }
            `}</style>
        </section>
    );
}

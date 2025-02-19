'use client'
import { LuSearch } from 'react-icons/lu'
import { FamilyTreeComp } from '@/components/utils/FamilyTree'

export default function FamilyTree() {
    return (
        <section className="min-h-screen  overflow-x-auto">
            {/* HEADER SECTION */}
            <div className="flex justify-center mx-[1rem] lg:mx-0">
                <div className="xl:w-1/2 lg:w-2/3 w-full flex flex-col items-center gap-2">
                    {/* header */}
                    <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
                        Family Tree
                    </h2>

                    <div className="rounded-[16px] mt-[1.5rem] border-[2px] border-appBrown2 md:px-[2rem] px-[1rem] md:py-3 py-2 w-full flex gap-2">
                        <LuSearch
                            size={22}
                            className="text-appBrown2 cursor-pointer"
                            // onClick={handleSearchSubmit} // Trigger search on click
                        />
                        <input
                            // value={searchTerm}
                            // onChange={handleSearchInput}
                            // onKeyDown={handleKeyPress} // Trigger search on Enter
                            placeholder="Search family members"
                            className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown"
                        />
                    </div>
                </div>
            </div>

            <div className=" h-full mt-[3rem]">
                <FamilyTreeComp />
            </div>
        </section>
    )
}

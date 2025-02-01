import React from 'react'
import { LuSearch } from 'react-icons/lu'
import { FamilyTreeParent } from '@/components/family-tree-card/family-tree-cards'

const FamilyTree = () => {
    const parentNames = [
        'Muo Ndichie Omile (Nnaebue)', // Generation 1
        'Joackim Ibeachuzinam Omile (Akulueuno)', // Generation 2
        'Benjamin Orakwute Omile (Okpokora)', // Generation 3
        'Mgbafor Ikeli (Nee Omile)', // Generation 4
        'Ayagha Okafor Egbochue (Nee Omile)', // Generation 5
        'Rose Udumelue Anyaeche (Nee Omile)', // Generation 6
        'Grace Okuazanwa Akunne (Nee Omile)', // Generation 7
    ]

    return (
        <section className="min-h-screen">
            {/* HEADER SECTION */}
            <div className="flex justify-center mx-[1rem] lg:mx-0">
                <div className="xl:w-1/2 lg:w-2/3 w-full flex flex-col items-center gap-2">
                    {/* header */}
                    <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
                        Family Tree
                    </h2>

                    <div className="rounded-[16px] mt-[1.5rem] border-[2px] border-appBrown2 md:px-[2rem] px-[1rem] md:py-3 py-2 w-full flex gap-2">
                        <LuSearch size={22} className="text-appBrown2" />
                        <input
                            // value={searchTerm}
                            // onChange={handleSearch}
                            placeholder="Search family members"
                            className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown"
                        />
                    </div>
                </div>
            </div>

            {/* FAMILY TREE */}
            <div className="my-[3rem] flex flex-col gap-3 mx-[4rem]">
                {/* Map over parentNames array to create multiple family trees */}

                <FamilyTreeParent name="Dunu" />
                <h2 className="font-playfair leading-tight text-brown-gradient-main text-[25px] md:text-[30px] text-left font-medium">
                    Seven Children of Omile
                </h2>
                {parentNames.map((name, index) => (
                    <FamilyTreeParent key={index} name={name} />
                ))}
            </div>
        </section>
    )
}

export default FamilyTree

'use client'
import React, { useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import {
    FamilyTreeParent,
    FamilyTreeChild,
} from '@/components/family-tree-card/family-tree-cards'
import { CircularProgress } from '@mui/material'

const Chronology = () => {
    const [marriedTo, setMarriedTo] = useState<
        { name: string; picture?: string; _id: string }[]
    >([])
    const [descendants, setDescendants] = useState<{ name: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('') // Track input value
    const [searchedName, setSearchedName] = useState('') // Actual name to search

    const parentNames = [
        'Muo Ndichie Omile (Nnaebue)', // Generation 1
        'Joachim Ibeachuzinam Omile (Akulueuno)', // Generation 2
        'Benjamin Orakwute Omile (Okpokora)', // Generation 3
        'Mgbafor Ikeli (Nee Omile)', // Generation 4
        'Ayagha Okafor Egbochue (Nee Omile)', // Generation 5
        'Roselin Udumelue Anyaeche (Nee Omile)', // Generation 6
        'Grace Okuazanwa Akunne (Nee Omile)', // Generation 7
    ]

    const fetchFamilyTree = async (name: string) => {
        if (!name.trim()) return

        setLoading(true)
        try {
            const encodedName = encodeURIComponent(name)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/family?name=${encodedName}`
            )
            const data = await response.json()

            if (data.data.length > 0) {
                const familyData = data.data[0]
                setMarriedTo(familyData.descendants.marriedTo || [])
                setDescendants(familyData.descendants.children || [])
            } else {
                setMarriedTo([])
                setDescendants([])
            }
            setLoading(false)
        } catch (error) {
            console.error('Error fetching family tree:', error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleSearchSubmit = () => {
        setSearchedName(searchTerm) // Update searched name
        fetchFamilyTree(searchTerm) // Perform search
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchSubmit()
        }
    }

    return (
        <section className="min-h-screen overflow-x-scroll md:overflow-x-hidden">
            {/* HEADER SECTION */}
            <div className="flex justify-center mx-[1rem] lg:mx-0">
                <div className="xl:w-1/2 lg:w-2/3 w-full flex flex-col items-center gap-2">
                    {/* header */}
                    <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
                        Family Chronology
                    </h2>

                    <div className="rounded-[16px] mt-[1.5rem] border-[2px] border-appBrown2 md:px-[2rem] px-[1rem] md:py-3 py-2 w-full flex gap-2">
                        <LuSearch
                            size={22}
                            className="text-appBrown2 cursor-pointer"
                            onClick={handleSearchSubmit} // Trigger search on click
                        />
                        <input
                            value={searchTerm}
                            onChange={handleSearchInput}
                            onKeyDown={handleKeyPress} // Trigger search on Enter
                            placeholder="Search family members"
                            className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown"
                        />
                    </div>
                </div>
            </div>

            {/* FAMILY TREE */}
            <div className="md:my-[3rem] my-[1rem]   flex flex-col gap-3 mx-[0.3rem] md:mx-[4rem]">
                {searchedName && (
                    <>
                        <h3 className="text-appBrown2 md:text-[15px] text-[13px] font-medium ">
                            Searching for the descendants of: {searchedName}
                        </h3>
                        {loading && (
                            <div className="p-4">
                                <CircularProgress size={22} color="secondary" />
                            </div>
                        )}
                        {descendants.length > 0 ? (
                            <FamilyTreeChild
                                marriedTo={marriedTo}
                                descendants={descendants}
                                // isFirstChild
                            />
                        ) : (
                            <p>No results found.</p>
                        )}
                    </>
                )}

                {/* Default family tree display */}

                <FamilyTreeParent name="Dunu" />
                <h2 className="font-playfair leading-tight text-brown-gradient-main text-[20px] md:text-[30px] text-left font-medium">
                    Seven Children of Omile
                </h2>
                {parentNames.map((name, index) => (
                    <FamilyTreeParent key={index} name={name} />
                ))}
            </div>
        </section>
    )
}

export default Chronology

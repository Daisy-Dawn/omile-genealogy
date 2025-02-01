// 'use client'
// import React, { useEffect, useState } from 'react'
// import { PiUsersFour } from 'react-icons/pi'
// import { IoIosArrowForward } from 'react-icons/io'
// import { IoIosArrowDown } from 'react-icons/io'
// import Image from 'next/image'
// import '../../app/globals.css'

// export const FamilyTreeParent = ({ name }: { name: string }) => {
//     const [collapseBar, setCollapseBar] = useState(false)
//     const [marriedTo, setMarriedTo] = useState<string[]>([])
//     const [descendants, setDescendants] = useState<{ name: string }[]>([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         const fetchFamilyTree = async () => {
//             if (!name) return

//             try {
//                 const encodedName = encodeURIComponent(name) // Properly encode spaces and special characters
//                 const response = await fetch(
//                     `${process.env.NEXT_PUBLIC_API_URL}/family?name=${encodedName}`
//                 )
//                 const data = await response.json()

//                 if (data.data.length > 0) {
//                     const familyData = data.data[0] // Assuming the first result is the correct one
//                     setMarriedTo(familyData.descendants.marriedTo || [])
//                     setDescendants(familyData.descendants.children || [])
//                 }
//             } catch (error) {
//                 console.error('Error fetching family tree:', error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchFamilyTree()
//     }, [name]) // Fetch when the name changes

//     const openBar = () => setCollapseBar(!collapseBar)

//     return (
//         <>
//             <div className="rounded-[16px] relative font-medium flex shadow-xl overflow-hidden min-h-[70px]">
//                 <div className="min-h-full w-[32px] bg-[#8D4315]"></div>

//                 {/* Text */}
//                 <div className="flex py-[1rem] w-full mx-[1.5rem] items-center justify-between">
//                     <div className="flex gap-2 items-center">
//                         <span>
//                             <PiUsersFour className="text-appBrown" size={30} />
//                         </span>
//                         <h2 className="text-[#7B3A12] text-[15px]">
//                             Tree of {name} Family
//                         </h2>
//                     </div>

//                     {/* Arrow Toggle */}
//                     <button onClick={openBar} className="mr-[2rem]">
//                         {collapseBar ? (
//                             <IoIosArrowDown
//                                 size={20}
//                                 className="text-appBrown"
//                             />
//                         ) : (
//                             <IoIosArrowForward
//                                 size={20}
//                                 className="text-appBrown"
//                             />
//                         )}
//                     </button>
//                 </div>
//             </div>

//             {/* Show descendants when expanded */}
//             {collapseBar && (
//                 <div className="ml-[1.5rem]">
//                     {loading ? (
//                         <p className="text-gray-500 text-sm ml-4">Loading...</p>
//                     ) : (
//                         <div className="family-tree-connector">
//                             <FamilyTreeChild
//                                 marriedTo={marriedTo}
//                                 descendants={descendants}
//                             />
//                         </div>
//                     )}
//                 </div>
//             )}
//         </>
//     )
// }

// export const FamilyTreeChild = ({
//     marriedTo,
//     descendants,
// }: {
//     marriedTo: string[]
//     descendants: { name: string }[]
// }) => {
//     const [openChild, setOpenChild] = useState<string | null>(null)
//     const [childData, setChildData] = useState<{
//         [key: string]: { marriedTo: string[]; descendants: { name: string }[] }
//     }>({})

//     const toggleChild = async (childName: string) => {
//         setOpenChild((prev) => (prev === childName ? null : childName))

//         if (!childData[childName]) {
//             try {
//                 const encodedName = encodeURIComponent(childName) // Properly encode spaces and special characters
//                 const response = await fetch(
//                     `${process.env.NEXT_PUBLIC_API_URL}/family?name=${encodedName}`
//                 )

//                 const data = await response.json()

//                 if (data.data.length > 0) {
//                     const familyData = data.data[0]
//                     setChildData((prev) => ({
//                         ...prev,
//                         [childName]: {
//                             marriedTo: familyData.descendants.marriedTo || [],
//                             descendants: familyData.descendants.children || [],
//                         },
//                     }))
//                 }
//             } catch (error) {
//                 console.error('Error fetching child details:', error)
//             }
//         }
//     }

//     return (
//         <>
//             <div className="rounded-[16px] relative mt-[1rem] transition-all duration-200 flex shadow-xl overflow-hidden min-h-[100px]">
//                 <div className="min-h-full w-[32px] bg-[#DB6820]"></div>

//                 <div className="flex py-[1rem] flex-col w-full">
//                     <div className="flex w-full mx-[1.5rem] items-center gap-2">
//                         <span className="w-[20px] h-[20px]">
//                             <Image
//                                 alt="ring"
//                                 src="/images/family-tree/marriage.svg"
//                                 width={20}
//                                 height={20}
//                                 className="w-full h-full object-contain"
//                             />
//                         </span>
//                         <span className="text-brown-gradient-main font-playfair font-medium text-[15px]">
//                             Married To:
//                         </span>{' '}
//                         {marriedTo.map((spouse, index) => (
//                             <div
//                                 key={index}
//                                 className="flex items-center gap-1"
//                             >
//                                 <span className="w-[20px] h-[20px]">
//                                     <Image
//                                         alt="children icon"
//                                         src="/images/family-tree/woman1.svg"
//                                         width={20}
//                                         height={20}
//                                         className="w-full h-full object-contain"
//                                     />
//                                 </span>
//                                 <p className="text-[#7B3A12] font-medium text-[14px]">
//                                     {spouse}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Children List */}
//                     <div className="flex w-full mx-[1.5rem] flex-col gap-[6px] mt-[1rem]">
//                         <div className="flex gap-[4px] items-center">
//                             <span className="w-[25px] h-[25px]">
//                                 <Image
//                                     alt="children"
//                                     src="/images/family-tree/children.svg"
//                                     width={25}
//                                     height={25}
//                                     className="w-full h-full object-contain"
//                                 />
//                             </span>
//                             <span className="text-brown-gradient-main font-playfair font-medium text-[15px]">
//                                 Children:
//                             </span>
//                         </div>
//                         {descendants.map((child) => (
//                             <div
//                                 key={child.name}
//                                 className="flex  ml-[5rem] items-center justify-between"
//                             >
//                                 <div className="flex items-center gap-1">
//                                     <span className="w-[25px] h-[25px]">
//                                         <Image
//                                             alt="children icon"
//                                             src="/images/family-tree/user.svg"
//                                             width={25}
//                                             height={25}
//                                             className="w-full h-full object-contain"
//                                         />
//                                     </span>
//                                     <p className="text-[#7B3A12] font-medium text-[14px]">
//                                         {child.name}
//                                     </p>
//                                 </div>

//                                 {/* Arrow Toggle */}
//                                 <button
//                                     onClick={() => toggleChild(child.name)}
//                                     className="mr-[5rem]"
//                                 >
//                                     {openChild === child.name ? (
//                                         <IoIosArrowDown
//                                             size={20}
//                                             className="text-appBrown"
//                                         />
//                                     ) : (
//                                         <IoIosArrowForward
//                                             size={20}
//                                             className="text-appBrown"
//                                         />
//                                     )}
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Recursive Rendering for Expanded Children */}
//             {openChild && childData[openChild] && (
//                 <div key={openChild} className="ml-[1.5rem]">
//                     <FamilyTreeChild
//                         marriedTo={childData[openChild].marriedTo}
//                         descendants={childData[openChild].descendants}
//                     />
//                 </div>
//             )}
//         </>
//     )
// }
'use client'
import { useEffect, useState, useRef } from 'react'
import { PiUsersFour } from 'react-icons/pi'
import { IoIosArrowForward } from 'react-icons/io'
import { IoIosArrowDown } from 'react-icons/io'
import Image from 'next/image'

export const FamilyTreeParent = ({ name }: { name: string }) => {
    const [collapseBar, setCollapseBar] = useState(false)
    const [marriedTo, setMarriedTo] = useState<string[]>([])
    const [descendants, setDescendants] = useState<{ name: string }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFamilyTree = async () => {
            if (!name) return

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
                }
            } catch (error) {
                console.error('Error fetching family tree:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFamilyTree()
    }, [name])

    const openBar = () => setCollapseBar(!collapseBar)

    return (
        <div className="relative">
            <div className="rounded-[16px] relative font-medium flex shadow-xl overflow-hidden min-h-[70px]">
                <div className="min-h-full w-[32px] bg-[#8D4315]"></div>

                <div className="flex py-[1rem] w-full mx-[1.5rem] items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <span>
                            <PiUsersFour className="text-appBrown" size={30} />
                        </span>
                        <h2 className="text-[#7B3A12] text-[15px]">
                            Tree of {name} Family
                        </h2>
                    </div>

                    <button onClick={openBar} className="mr-[2rem]">
                        {collapseBar ? (
                            <IoIosArrowDown
                                size={20}
                                className="text-appBrown"
                            />
                        ) : (
                            <IoIosArrowForward
                                size={20}
                                className="text-appBrown"
                            />
                        )}
                    </button>
                </div>
            </div>

            {collapseBar && (
                <div className="relative">
                    {/* Half rectangle connector */}
                    <div className="absolute left-4 top-[70px] w-[2px] h-[calc(100%-70px)] bg-[#DB6820]" />
                    <div className="absolute left-4 top-[70px] w-[24px] h-[2px] bg-[#DB6820]" />
                    {/* Arrow at the end */}
                    <div
                        className="absolute left-[28px] top-[66px] w-0 h-0 
                                  border-t-[4px] border-t-transparent
                                  border-b-[4px] border-b-transparent
                                  border-l-[8px] border-l-[#DB6820]"
                    />

                    <div className="ml-[2rem] mt-[1rem]">
                        {loading ? (
                            <p className="text-gray-500 text-sm ml-4">
                                Loading...
                            </p>
                        ) : (
                            <FamilyTreeChild
                                marriedTo={marriedTo}
                                descendants={descendants}
                                isFirstChild
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export const FamilyTreeChild = ({
    marriedTo,
    descendants,
}: {
    marriedTo: string[]
    descendants: { name: string }[]
    isFirstChild?: boolean
}) => {
    const [openChild, setOpenChild] = useState<string | null>(null)
    const [childData, setChildData] = useState<{
        [key: string]: { marriedTo: string[]; descendants: { name: string }[] }
    }>({})
    const [connectorHeight, setConnectorHeight] = useState<number>(0)
    const childRef = useRef<HTMLDivElement>(null)

    const toggleChild = async (childName: string) => {
        setOpenChild((prev) => (prev === childName ? null : childName))

        if (!childData[childName]) {
            try {
                const encodedName = encodeURIComponent(childName)
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/family?name=${encodedName}`
                )
                const data = await response.json()

                if (data.data.length > 0) {
                    const familyData = data.data[0]
                    setChildData((prev) => ({
                        ...prev,
                        [childName]: {
                            marriedTo: familyData.descendants.marriedTo || [],
                            descendants: familyData.descendants.children || [],
                        },
                    }))
                }
            } catch (error) {
                console.error('Error fetching child details:', error)
            }
        }
    }

    useEffect(() => {
        if (openChild && childRef.current) {
            const openChildElement = childRef.current.querySelector(
                `[data-child="${openChild}"]`
            )
            if (openChildElement) {
                const { top: childTop } =
                    openChildElement.getBoundingClientRect()
                const { top: parentTop } =
                    childRef.current.getBoundingClientRect()
                const height = childTop - parentTop + 20 // Add 20px for padding
                setConnectorHeight(height)
            }
        }
    }, [openChild, childData])

    return (
        <div className="relative" ref={childRef}>
            <div className="rounded-[16px] relative transition-all duration-200 flex shadow-xl overflow-hidden min-h-[100px]">
                <div className="min-h-full w-[32px] bg-[#DB6820]"></div>

                <div className="flex py-[1rem] flex-col w-full">
                    <div className="flex w-full mx-[1.5rem] items-center gap-2">
                        <span className="w-[20px] h-[20px]">
                            <Image
                                alt="ring"
                                src="/images/family-tree/marriage.svg"
                                width={20}
                                height={20}
                                className="w-full h-full object-contain"
                            />
                        </span>
                        <span className="text-brown-gradient-main font-playfair font-medium text-[15px]">
                            Married To:
                        </span>
                        {marriedTo.map((spouse, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-1"
                            >
                                <span className="w-[20px] h-[20px]">
                                    <Image
                                        alt="children icon"
                                        src="/images/family-tree/woman1.svg"
                                        width={20}
                                        height={20}
                                        className="w-full h-full object-contain"
                                    />
                                </span>
                                <p className="text-[#7B3A12] font-medium text-[14px]">
                                    {spouse}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full mx-[1.5rem] flex-col gap-[6px] mt-[1rem]">
                        <div className="flex gap-[4px] items-center">
                            <span className="w-[25px] h-[25px]">
                                <Image
                                    alt="children"
                                    src="/images/family-tree/children.svg"
                                    width={25}
                                    height={25}
                                    className="w-full h-full object-contain"
                                />
                            </span>
                            <span className="text-brown-gradient-main font-playfair font-medium text-[15px]">
                                Children:
                            </span>
                        </div>
                        {descendants.map((child) => (
                            <div
                                key={child.name}
                                className="relative"
                                data-child={child.name}
                            >
                                {openChild === child.name && (
                                    <>
                                        {/* L-shaped connector */}
                                        <div
                                            className="absolute left-[-1rem] top-[10px] w-[24px] border-l-[#DB6820] border-t-[#DB6820] border-t-[2px] border-l-[2px]"
                                            style={{
                                                height: `${connectorHeight}px`,
                                            }}
                                        />
                                        {/* Arrow at the end */}
                                        <div
                                            className="absolute left-[13px] top-[7px] w-0 h-0 
                                                      border-t-[4px] border-t-transparent
                                                      border-b-[4px] border-b-transparent
                                                      border-l-[8px] border-l-[#DB6820]"
                                        />
                                    </>
                                )}

                                <div className="flex ml-[5rem] items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <span className="w-[25px] h-[25px]">
                                            <Image
                                                alt="children icon"
                                                src="/images/family-tree/user.svg"
                                                width={25}
                                                height={25}
                                                className="w-full h-full object-contain"
                                            />
                                        </span>
                                        <p className="text-[#7B3A12] font-medium text-[14px]">
                                            {child.name}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => toggleChild(child.name)}
                                        className="mr-[5rem]"
                                    >
                                        {openChild === child.name ? (
                                            <IoIosArrowDown
                                                size={20}
                                                className="text-appBrown"
                                            />
                                        ) : (
                                            <IoIosArrowForward
                                                size={20}
                                                className="text-appBrown"
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {openChild && childData[openChild] && (
                <div key={openChild} className="ml-[3rem] mt-[1rem]">
                    <FamilyTreeChild
                        marriedTo={childData[openChild].marriedTo}
                        descendants={childData[openChild].descendants}
                    />
                </div>
            )}
        </div>
    )
}

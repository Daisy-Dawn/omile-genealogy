'use client'
import { useEffect, useState, useRef } from 'react'
import { PiUsersFour } from 'react-icons/pi'
import { IoIosArrowForward } from 'react-icons/io'
import { IoIosArrowDown } from 'react-icons/io'
import Image from 'next/image'
import { Avatar, CircularProgress } from '@mui/material'
import Gallery from '../gallery/Gallery'

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
            {/* Half rectangle connector */}
            {collapseBar && (
                <>
                    <div className="absolute top-2 overflow-hidden left-2 w-[2px] h-[98%] md:h-[98.4%] bg-[#8D4315]" />

                    {/* Horizontal Line */}
                    <div
                        // className="absolute top-[99.5%] w-[35px] left-2 h-[2px] bg-[#8D4315]"
                        className="absolute top-[99%] md:top-[99.3%] w-[70%]  left-2 h-[2px] bg-[#8D4315]"
                        // style={{ width: `${barWidth}px` }}
                        style={
                            {
                                // width: `${barWidth}px`, // Add extra width if fetch was successful
                            }
                        }
                    />
                </>
            )}
            <div
                onClick={openBar}
                className="rounded-[16px] cursor-pointer relative font-medium flex shadow-xl min-h-[70px]"
            >
                <div className="min-h-full  rounded-l-[16px] w-[32px] bg-[#8D4315]"></div>

                <div className="flex py-[1rem] w-full mx-2 md:mx-[1.5rem] items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <span>
                            <PiUsersFour className="text-appBrown" size={30} />
                        </span>
                        <h2 className="text-[#7B3A12] text-[13px] lg:text-[15px]">
                            Tree of {name} Family
                        </h2>
                    </div>

                    <button className="md:mr-[2rem] mr-3">
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
                    <div className="md:ml-[2rem] ml-[0.7rem] mt-[1rem]">
                        {loading ? (
                            <div className="p-4">
                                <CircularProgress size={22} color="secondary" />
                            </div>
                        ) : (
                            <FamilyTreeChild
                                marriedTo={marriedTo}
                                descendants={descendants}
                                isFirstChild
                                // onFetchSuccess={handleFetchSuccess} // Pass the callback
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
    onFetchSuccess,
}: {
    marriedTo: string[]
    descendants: { name: string; picture?: string }[]
    isFirstChild?: boolean
    onFetchSuccess?: () => void
}) => {
    const [showGallery, setShowGallery] = useState(false)
    const [selectedChild, setSelectedChild] = useState<string | null>(null)
    const [openChild, setOpenChild] = useState<string | null>(null)
    const [childData, setChildData] = useState<{
        [key: string]: {
            marriedTo: string[]
            descendants: { name: string; picture: string }[]
        }
    }>({})
    const [connectorHeight, setConnectorHeight] = useState<number>(0)
    const childRef = useRef<HTMLDivElement>(null)
    const nestedChildRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

    const toggleChild = async (childName: string) => {
        // Toggle the open/close state immediately
        setOpenChild((prev) => (prev === childName ? null : childName))

        // Fetch data only when opening the child (if it's not already fetched)
        if (childName !== openChild && !childData[childName]) {
            try {
                setLoading((prev) => ({ ...prev, [childName]: true }))
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

                    // Notify the parent about successful fetch
                    // onFetchSuccess() // Trigger the parent's callback function
                }
                setLoading((prev) => ({ ...prev, [childName]: false }))
            } catch (error) {
                console.error('Error fetching child details:', error)
                setLoading((prev) => ({ ...prev, [childName]: false }))
            }
        }
    }

    useEffect(() => {
        if (openChild && childRef.current && nestedChildRef.current) {
            const openChildElement = childRef.current.querySelector(
                `[data-child="${openChild}"]`
            ) as HTMLElement
            if (openChildElement) {
                const { top: childTop } =
                    openChildElement.getBoundingClientRect()
                const { top: nestedChildTop, height: nestedChildHeight } =
                    nestedChildRef.current.getBoundingClientRect()
                const { top: parentTop } =
                    childRef.current.getBoundingClientRect()

                const startPosition = childTop - parentTop + 10 // 10px offset for the arrow
                const endPosition =
                    nestedChildTop - parentTop + nestedChildHeight / 2

                const height = endPosition - startPosition
                setConnectorHeight(height)
            }
        }
    }, [openChild, childData])

    return (
        <div className="relative " ref={childRef}>
            <div className="rounded-[16px] relative transition-all  app-bg duration-200 flex shadow-xl  min-h-[100px]">
                <div className="min-h-full overflow-hidden rounded-l-[16px] w-[32px] bg-[#DB6820]"></div>

                <div className="flex py-[1rem] flex-col w-full">
                    {/* married To large screen */}
                    <div className=" w-full hidden  mx-[0.5rem] md:mx-[1.5rem] items-center gap-2">
                        <span className="w-[20px] h-[20px]">
                            <Image
                                alt="ring"
                                src="/images/family-tree/marriage.svg"
                                width={20}
                                height={20}
                                className="w-full h-full object-contain"
                            />
                        </span>
                        <span className="text-brown-gradient-main font-playfair font-medium text-[13px] md:text-[15px]">
                            Married To:
                        </span>
                        {marriedTo.map((spouse, index) => (
                            <div
                                key={index}
                                className="flex md:flex-row flex-col items-center gap-1"
                            >
                                <span className="w-[20px]  h-[20px]">
                                    <Image
                                        alt="children icon"
                                        src="/images/family-tree/woman1.svg"
                                        width={20}
                                        height={20}
                                        className="w-full h-full object-contain"
                                    />
                                </span>
                                <p className="text-[#7B3A12] font-medium text-[13px] md:text-[14px]">
                                    {spouse}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* married to small screen */}
                    <div className="flex w-full mx-[0.5rem] md:mx-[1.5rem] flex-col gap-1 md:gap-[6px] ">
                        <div className="flex gap-[4px] items-center">
                            <span className=" md:w-[25px] w-[20px] h-[20px] md:h-[25px]">
                                <Image
                                    alt="ring"
                                    src="/images/family-tree/marriage.svg"
                                    width={20}
                                    height={20}
                                    className="w-full h-full object-contain"
                                />
                            </span>
                            <span className="text-brown-gradient-main font-playfair font-medium text-[13px] md:text-[15px]">
                                Married To:
                            </span>
                        </div>
                        {marriedTo.map((spouse, index) => (
                            <div key={index} className="relative">
                                <div className="flex md:ml-[5rem] ml-[2rem] items-center justify-between">
                                    <div className="flex items-center gap-1 md:gap-3">
                                        <span className="md:w-[20px] w-[20px] h-[20px] hidden md:block md:h-[20px]">
                                            <Image
                                                alt="children icon"
                                                src="/images/family-tree/woman1.svg"
                                                width={20}
                                                height={20}
                                                className="w-full h-full object-contain"
                                            />
                                        </span>
                                        <p className="text-[#7B3A12] font-medium text-[13px] md:text-[14px]">
                                            {spouse}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full mx-[0.5rem] md:mx-[1.5rem] flex-col gap-1 md:gap-[6px] mt-3 md:mt-[1rem]">
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
                            <span className="text-brown-gradient-main font-playfair font-medium text-[13px] md:text-[15px]">
                                Children:
                            </span>
                        </div>
                        {descendants.map((child) => (
                            <div
                                key={child.name}
                                className="relative"
                                data-child={child.name}
                            >
                                {openChild === child.name &&
                                    childData[openChild] &&
                                    childData[openChild].descendants &&
                                    childData[openChild].descendants.length >
                                        0 && (
                                        <>
                                            {/* L-shaped connector */}
                                            <div
                                                className="absolute left-[-2.8rem] md:left-[-4rem] w-[50px] md:w-[80px] border-l-[#DB6820] border-t-[#DB6820] border-t-[2px] border-l-[2px]"
                                                style={{
                                                    height: `${connectorHeight}px`,
                                                    top: '10px', // Keep the start position consistent
                                                }}
                                            />
                                            {/* Arrow at the end */}
                                            <div
                                                className="absolute left-[10px] md:left-[13px] top-[7px] md:top-[6px] w-0 h-0
                                                      border-t-[4px] border-t-transparent
                                                      border-b-[4px] border-b-transparent
                                                      border-l-[8px] border-l-[#DB6820]"
                                            />

                                            {/* NEW Horizontal Line extending to nested child */}
                                            <div
                                                className="absolute w-[50px] left-[-2.8rem] md:left-[-4rem] md:w-[80px] border-t-[2px] border-t-[#DB6820]"
                                                style={{
                                                    // width: '20px', // Adjust this to reach the nested child edge
                                                    // left: '-1rem', // Align it with the vertical line
                                                    top: `${
                                                        connectorHeight + 10
                                                    }px`, // Position it at the end of the vertical line
                                                }}
                                            />

                                            {/* Arrow at the end */}
                                            <div
                                                className="absolute hidden md:block left-[13px] top-[6px] w-0 h-0
                        border-t-[4px] border-t-transparent
                        border-b-[4px] border-b-transparent
                        border-l-[8px] border-l-[#DB6820]"
                                            />
                                        </>
                                    )}

                                <div className="flex md:ml-[5rem] cursor-pointer ml-[2rem] items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-[25px] h-[25px]">
                                            <Image
                                                alt="children icon"
                                                src="/images/family-tree/user.svg"
                                                width={25}
                                                height={25}
                                                className="w-full h-full object-contain"
                                            />
                                        </span>
                                        <p
                                            onClick={() =>
                                                toggleChild(child.name)
                                            }
                                            className="text-[#7B3A12] font-medium text-[13px] md:text-[14px]"
                                        >
                                            {child.name}
                                        </p>
                                        <>
                                            {/* Avatar Click Triggers Gallery */}
                                            <div
                                                onClick={() => {
                                                    setSelectedChild(child.name) // Store selected child's name
                                                    setShowGallery(true)
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 22,
                                                        height: 22,
                                                    }}
                                                    src={
                                                        child.picture ||
                                                        'https://www.svgrepo.com/show/23012/profile-user.svg'
                                                    }
                                                    alt={child.name}
                                                />
                                            </div>

                                            {/* Show Gallery When `showGallery` is True */}
                                            {showGallery && selectedChild && (
                                                <Gallery
                                                    onClose={() =>
                                                        setShowGallery(false)
                                                    }
                                                    childName={selectedChild}
                                                />
                                            )}
                                        </>
                                    </div>

                                    <button className="md:mr-[5rem] z-50 mr-5">
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

                                {loading[child.name] ? (
                                    <div className="md:ml-[10%] ml-[5rem] mt-2">
                                        <CircularProgress
                                            size={22}
                                            color="secondary"
                                        />
                                    </div>
                                ) : (
                                    openChild === child.name &&
                                    childData[openChild] &&
                                    childData[openChild].descendants &&
                                    childData[openChild].descendants.length >
                                        0 && (
                                        <div
                                            key={openChild}
                                            className="md:ml-[3rem] ml-[0.7rem] mt-[1rem]"
                                            ref={nestedChildRef}
                                        >
                                            <FamilyTreeChild
                                                marriedTo={
                                                    childData[openChild]
                                                        .marriedTo
                                                }
                                                descendants={
                                                    childData[openChild]
                                                        .descendants
                                                }
                                                onFetchSuccess={onFetchSuccess}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* {openChild && childData[openChild] && (
                <div
                    key={openChild}
                    className="md:ml-[3rem] ml-[0.7rem]  mt-[1rem]"
                    ref={nestedChildRef}
                >
                    <FamilyTreeChild
                        marriedTo={childData[openChild].marriedTo}
                        descendants={childData[openChild].descendants}
                        onFetchSuccess={onFetchSuccess} // Pass the callback to nested child
                    />
                </div>
            )} */}
        </div>
    )
}

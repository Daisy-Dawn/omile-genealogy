'use client'
import { useEffect, useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import { Modal, Box } from '@mui/material'
import { Photo } from '@/app/photos/page'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6'

interface GalleryProps {
    onClose: () => void
    personName: string // This can be either the child's name or spouse's name
}

const Gallery = ({ onClose, personName }: GalleryProps) => {
    const [open, setOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [photos, setPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState(true)
    const [slidesPerView, setSlidesPerView] = useState(3)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swiperRef = useRef<any>(null)

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const { data } = await axios.get<Photo[]>(
                    `${process.env.NEXT_PUBLIC_API_URL}/photos`
                )
                setPhotos(data)
            } catch (error) {
                console.error('Error fetching photos:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPhotos()
    }, [])

    const filteredPhotos = useMemo(() => {
        if (loading || !personName.trim()) return [] // Prevent unnecessary filtering

        // Normalize function: Convert to lowercase, trim, and preserve hyphens
        const normalizeName = (name: string) =>
            name.toLowerCase().trim().replace(/\s+/g, ' ') // Normalize spaces but keep hyphens

        const normalizedPersonName = normalizeName(personName) // Normalize search name

        const matchingPhotos = photos.filter((photo) => {
            // Split by both colon (:) and comma (,) to separate family name and individual names
            const nameGroups = photo.name
                .toLowerCase()
                .split(/\s*[:|,]\s*/) // Split by `:` or `,`
                .map((name) => normalizeName(name)) // Normalize each name

            // Check if the personName matches any of the names (including the family label)
            return nameGroups.includes(normalizedPersonName)
        })

        // Prioritize 'single-photo' type at the first index
        return matchingPhotos.sort((a, b) =>
            a.type === 'single-photo' ? -1 : b.type === 'single-photo' ? 1 : 0
        )
    }, [photos, personName, loading])

    const handleOpen = (image: string) => {
        setSelectedImage(image)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedImage(null)
    }

    // Adjust slidesPerView based on screen width
    useEffect(() => {
        const handleResize = () => {
            setSlidesPerView(window.innerWidth < 768 ? 1 : 3)
        }

        handleResize() // Set initial value
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (loading) return null // Ensure nothing renders while loading

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#24202014]">
            <div
                className="bg-[#F9E6D9] h-[400px] w-full md:w-[700px] p-4 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className={` absolute top-[-10px] right-4 md:rounded-[12px] rounded-[12px] button-home text-white mt-[1rem] md:text-[15px] text-[11px] sm:text-[13px] md:px-3 px-0 md:py-2 py-2 w-[100px] flex justify-center items-center`}
                >
                    Close
                </button>

                <button
                    onClick={() => swiperRef.current?.swiper?.slidePrev()}
                    className="absolute top-7 left-1/2 z-50 transform -translate-y-1/2 bg-transparent border-appBrown2 border-[2px] text-appBrown2 p-1 md:p-2 rounded-full shadow-md"
                >
                    <FaArrowUpLong
                        // size={14}
                        className="size-[14px] md:size-[17px]"
                    />
                </button>

                <button
                    onClick={() => swiperRef.current?.swiper?.slideNext()}
                    className="absolute bottom-[0px] md:bottom-[-20px] left-1/2 z-50 transform -translate-y-1/2 bg-transparent border-appBrown2 border-[2px] text-appBrown2 p-1 md:p-2 rounded-full shadow-md"
                >
                    <FaArrowDownLong
                        className="size-[14px] md:size-[17px]"
                        // size={14}
                    />
                </button>

                {filteredPhotos.length > 0 ? (
                    <div className="relative">
                        {/* Swiper Component */}
                        <Swiper
                            ref={swiperRef}
                            modules={[Navigation]}
                            direction="vertical"
                            spaceBetween={10}
                            slidesPerView={1}
                            className="md:mt-[3.5rem] mt-[2.3rem] h-[300px] w-full"
                        >
                            {Array.from({
                                length: Math.ceil(
                                    filteredPhotos.length / slidesPerView
                                ),
                            }).map((_, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="h-[280px] w-full"
                                >
                                    <div
                                        className={`grid grid-cols-1 ${
                                            slidesPerView === 3
                                                ? 'md:grid-cols-3'
                                                : ''
                                        } gap-4`}
                                    >
                                        {filteredPhotos
                                            .slice(
                                                index * slidesPerView,
                                                index * slidesPerView +
                                                    slidesPerView
                                            ) // Show 3 or 1 images per slide
                                            .map((photo) => (
                                                <div
                                                    key={photo._id}
                                                    className="h-[280px] w-full rounded-[29px] shadow-sm overflow-hidden"
                                                >
                                                    <Image
                                                        src={photo.photourl}
                                                        alt={photo.name}
                                                        width={280}
                                                        height={280}
                                                        className="cursor-pointer object-cover object-top h-full w-full rounded-lg"
                                                        onClick={() =>
                                                            handleOpen(
                                                                photo.photourl
                                                            )
                                                        }
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-20">
                        No matching photos found.
                    </p>
                )}
            </div>

            {selectedImage && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    sx={{
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                >
                    <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
                        <div className="md:h-[500px] h-[400px] w-[310px] md:w-[500px] overflow-hidden">
                            <Image
                                src={selectedImage}
                                alt="Selected"
                                width={500}
                                height={500}
                                className="object-cover h-full w-full rounded-lg"
                            />
                        </div>
                    </Box>
                </Modal>
            )}
        </div>
    )
}

export default Gallery

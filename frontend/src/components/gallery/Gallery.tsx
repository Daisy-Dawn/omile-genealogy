'use client'
import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { Modal, Box } from '@mui/material'
import { Photo } from '@/app/photos/page'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

interface GalleryProps {
    onClose: () => void
    personName: string // This can be either the child's name or spouse's name
}

const Gallery = ({ onClose, personName }: GalleryProps) => {
    const [open, setOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [photos, setPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState(true)

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

    if (loading) return null // Ensure nothing renders while loading

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#24202014]">
            <div
                className="bg-white h-[400px] w-[700px] p-4 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-4 bg-gray-600 text-white rounded-md px-4 py-2"
                    onClick={onClose}
                >
                    Close
                </button>

                {filteredPhotos.length > 0 ? (
                    <Swiper
                        modules={[Navigation]}
                        navigation
                        spaceBetween={10}
                        slidesPerView={3} // Show 3 images at a time
                        className="mt-[2.5rem] h-[300px] w-full"
                    >
                        {filteredPhotos.map((photo) => (
                            <SwiperSlide
                                key={photo._id}
                                className="h-[300px] w-full"
                            >
                                <div className="h-full w-full overflow-hidden">
                                    <Image
                                        src={photo.photourl}
                                        alt={photo.name}
                                        width={300}
                                        height={300}
                                        className="cursor-pointer object-cover h-full w-full rounded-lg"
                                        onClick={() =>
                                            handleOpen(photo.photourl)
                                        }
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
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
                        <div className="h-[500px] w-full overflow-hidden">
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

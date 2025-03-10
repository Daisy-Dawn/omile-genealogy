'use client'
import Image from 'next/image'
import type React from 'react'
import { useState, useEffect, DragEvent, ChangeEvent } from 'react'
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io'
import { LuSearch } from 'react-icons/lu'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import axios from 'axios'
import UploadPhotoDrawer from '@/components/utils/DrawerComp'
import { CircularProgress, Tooltip } from '@mui/material'
import { PiHandArrowDownFill } from 'react-icons/pi'

export type Photo = {
    _id: string
    photourl: string
    name: string
    type: string
}

const Photos = () => {
    const [activeButton, setActiveButton] = useState('All-Photos')
    const [photos, setPhotos] = useState<Photo[]>([])
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [open, setOpen] = useState(false)

    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [dragging, setDragging] = useState<boolean>(false)
    const [value, setValue] = useState('historical')

    const [isHovered, setIsHovered] = useState(false)
    const [showPhotos, setShowPhotos] = useState(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return
            }
            setOpen(open)
        }

    useEffect(() => {
        const fetchPhotos = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const { data } = await axios.get<Photo[]>(
                    `${process.env.NEXT_PUBLIC_API_URL}/photos`
                )
                setPhotos(data)
                setFilteredPhotos(data)
                setSelectedPhoto(data[0])
            } catch (error) {
                setError('Failed to fetch photos. Please try again.')
                console.error('Error fetching photos:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPhotos()
    }, [])

    useEffect(() => {
        let filtered = photos
        if (activeButton !== 'All-Photos') {
            filtered = photos.filter((photo) => photo.type === activeButton)
        }
        if (searchTerm) {
            filtered = filtered.filter((photo) =>
                photo.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        setFilteredPhotos(filtered)
        setSelectedPhoto(filtered[0] || null)
    }, [activeButton, photos, searchTerm])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleButtonClick = (buttonType: string) => {
        setActiveButton(buttonType)
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile)) // Generate preview URL
        }
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setDragging(false)

        const droppedFile = event.dataTransfer.files?.[0]
        if (droppedFile) {
            setFile(droppedFile)
            setPreview(URL.createObjectURL(droppedFile)) // Generate preview URL
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value)
    }

    const handleDeletePhoto = async (photo: Photo) => {
        if (!photo?._id) return

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${photo.name}?`
        )
        if (!confirmDelete) return

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/photos/${photo._id}`
            )

            // Remove the deleted photo from state
            const updatedPhotos = photos.filter((p) => p._id !== photo._id)
            setPhotos(updatedPhotos)
            setFilteredPhotos(updatedPhotos)

            // Reset selected photo if it was the deleted one
            if (selectedPhoto?._id === photo._id) {
                setSelectedPhoto(updatedPhotos[0] || null)
            }
        } catch (error) {
            setError('Failed to delete photo. Please try again.')
            console.error('Error deleting photo:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="min-h-screen mb-[2rem]">
            {/* HEADER SECTION */}
            <div className="flex justify-center mx-[1rem] lg:mx-0">
                <div className="xl:w-2/3 lg:w-2/3 w-full flex flex-col items-center gap-2">
                    <h2 className="font-playfair leading-tight text-brown-gradient-main text-[32px] md:text-[50px] text-center font-medium">
                        Family photo Gallery
                    </h2>

                    <div className="flex md:gap-3 gap-1 justify-center flex-wrap md:flex-nowrap items-center">
                        {[
                            'All-Photos',
                            'historical',
                            'recentEvents',
                            'families',
                            'single-photo',
                        ].map((buttonType) => (
                            <button
                                key={buttonType}
                                onClick={() => handleButtonClick(buttonType)}
                                className={`md:rounded-[12px] rounded-[12px] ${
                                    activeButton === buttonType
                                        ? 'button-home text-white transition-all duration-100'
                                        : 'bg-transparent border-[1px] border-appBrown2 text-appBrown2'
                                } mt-1 md:mt-[1rem] md:text-[15px] text-[11px] sm:text-[13px] md:px-3 px-0 md:py-3 py-2 w-[100px] md:min-w-[150px] flex justify-center items-center`}
                            >
                                {buttonType === 'All-Photos'
                                    ? 'All Photos'
                                    : buttonType === 'recentEvents'
                                    ? 'Recent Events'
                                    : buttonType === 'single-photo'
                                    ? 'Profile Photos'
                                    : buttonType.charAt(0).toUpperCase() +
                                      buttonType.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="flex w-full items-center gap-3">
                        {/* upload a photo button */}
                        <button
                            onClick={toggleDrawer(true)}
                            className={`md:rounded-[12px] rounded-[12px] button-home text-white mt-[1rem] md:text-[15px] text-[11px] sm:text-[13px] md:px-3 px-0 md:py-3 py-2 w-[100px] md:min-w-[150px] flex justify-center items-center`}
                        >
                            Upload a photo
                        </button>

                        <div className="rounded-[16px] mt-[1.5rem] border-[2px] border-appBrown2 md:px-[2rem] px-[1rem] md:py-3 py-2 w-full flex gap-2">
                            <LuSearch size={22} className="text-appBrown2" />
                            <input
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search"
                                className="w-full bg-transparent text-appBrown2 outline-none placeholder:text-appBrown2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="min-h-[50vh] flex justify-center items-center">
                    <CircularProgress size={27} color="secondary" />
                </div>
            )}

            {error && (
                <div className="text-red-500 text-center py-4">{error}</div>
            )}

            {!isLoading && !error && filteredPhotos.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                    No photos found.
                </div>
            )}

            {!isLoading && filteredPhotos.length > 0 && (
                <div>
                    {/* PHOTOS COLLAGE */}
                    <div className="grid px-[1rem] lg:px-[3rem] my-[4rem] grid-cols-1 lg:grid-cols-5 md:grid-cols-4 gap-[2rem] md:gap-[1rem] lg:gap-[2rem]">
                        {filteredPhotos.length > 0 ? (
                            <>
                                {/* Large image display */}
                                <div
                                    className="relative rounded-[29px] h-fit md:col-span-2 shadow-xl bg-[#FDEBDD] overflow-hidden"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    {/* Large Image */}
                                    <div className="md:h-[450px] h-[350px] w-full relative">
                                        <Image
                                            width={400}
                                            height={400}
                                            src={selectedPhoto?.photourl || ''}
                                            alt={
                                                selectedPhoto?.name ||
                                                'Large photo'
                                            }
                                            className="w-full h-full object-cover object-top "
                                        />

                                        {/* Hover Overlay */}
                                        {isHovered && (
                                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity ease-in-out duration-300">
                                                <button
                                                    onClick={() => {
                                                        if (selectedPhoto)
                                                            handleDeletePhoto(
                                                                selectedPhoto
                                                            )
                                                    }}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
                                                >
                                                    Delete Photo
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Photo Name */}
                                    <div className="py-[1rem] px-[1rem]">
                                        <p className="text-appBrown2 capitalize font-medium">
                                            {selectedPhoto?.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Swiper Slider */}
                                <div className="lg:col-span-3 md:col-span-2 flex flex-col md:mt-[17%] xl:mt-[8%] lg:mt-[15%] h-full">
                                    <div className="carousel-wrapper relative">
                                        <Swiper
                                            modules={[Navigation]}
                                            spaceBetween={20}
                                            slidesPerView={2}
                                            navigation={{
                                                prevEl: '.custom-prev',
                                                nextEl: '.custom-next',
                                            }}
                                            slideToClickedSlide={true}
                                            className="mySwiper"
                                            breakpoints={{
                                                800: {
                                                    slidesPerView: 3,
                                                },
                                                1024: {
                                                    slidesPerView: 3,
                                                },
                                            }}
                                        >
                                            {filteredPhotos.map((photo) => (
                                                <SwiperSlide key={photo._id}>
                                                    <div
                                                        className="rounded-[14px] shadow-xl bg-[#FDEBDD] overflow-hidden cursor-pointer"
                                                        onClick={() =>
                                                            setSelectedPhoto(
                                                                photo
                                                            )
                                                        }
                                                    >
                                                        <div className="md:h-[300px] lg:h-[280px] xl:h-[300px] h-[200px] w-full">
                                                            <Image
                                                                width={300}
                                                                height={300}
                                                                src={
                                                                    photo.photourl ||
                                                                    '/placeholder.svg'
                                                                }
                                                                alt={photo.name}
                                                                className="w-full h-full object-top object-cover"
                                                            />
                                                        </div>
                                                        <div className="py-2 px-[1rem]">
                                                            <p className="text-appBrown2 text-[14px] capitalize font-medium">
                                                                {photo.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                    <div className="w-full gap-3 flex justify-center items-center mt-4">
                                        {/* Scroll Buttons */}
                                        <div className="w-[80%] gap-3 flex flex-col justify-center items-center ">
                                            <div className="rounded-[33px] w-[150px] bg-[#FDEBDD] border-[1px] border-appBrown2 px-[0.7rem] py-[0.5rem] flex justify-between items-center">
                                                <button className="custom-prev">
                                                    <IoIosArrowRoundBack
                                                        size={19}
                                                        className="text-appBrown"
                                                    />
                                                </button>
                                                <button className="custom-next">
                                                    <IoIosArrowRoundForward
                                                        size={19}
                                                        className="text-appBrown"
                                                    />
                                                </button>
                                            </div>
                                            <p className="text-appBrown2 font-medium">
                                                Scroll to explore
                                            </p>
                                        </div>

                                        <Tooltip title="View all Photos">
                                            <button
                                                onClick={() =>
                                                    setShowPhotos(!showPhotos)
                                                }
                                                className=""
                                            >
                                                <PiHandArrowDownFill
                                                    className="text-appBrown2"
                                                    size={24}
                                                />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="col-span-5 text-center">
                                <p className="text-appBrown2 font-medium">
                                    No photos found.
                                </p>
                            </div>
                        )}
                    </div>

                    {showPhotos && (
                        <div className="grid px-[1rem] lg:px-[3rem] grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredPhotos.map((photo) => (
                                <div
                                    key={photo._id}
                                    className="flex flex-col h-full"
                                >
                                    <div
                                        className="rounded-[14px] shadow-xl bg-[#FDEBDD] overflow-hidden cursor-pointer"
                                        onClick={() => setSelectedPhoto(photo)}
                                    >
                                        <div className="md:h-[300px] lg:h-[280px] xl:h-[300px] h-[200px] w-full">
                                            <Image
                                                width={300}
                                                height={300}
                                                src={
                                                    photo.photourl ||
                                                    '/placeholder.svg'
                                                }
                                                alt={photo.name}
                                                className="w-full h-full object-top object-cover"
                                            />
                                        </div>
                                        <div className="py-2 px-[1rem]">
                                            <p className="text-appBrown2 text-[14px] capitalize font-medium">
                                                {photo.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Photo Drawer */}
                    <UploadPhotoDrawer
                        open={open}
                        setFile={setFile}
                        setPreview={setPreview}
                        toggleDrawer={toggleDrawer}
                        dragging={dragging}
                        setDragging={setDragging}
                        file={file}
                        preview={preview}
                        handleDrop={handleDrop}
                        handleFileChange={handleFileChange}
                        value={value}
                        handleChange={handleChange}
                    />
                </div>
            )}
        </section>
    )
}

export default Photos

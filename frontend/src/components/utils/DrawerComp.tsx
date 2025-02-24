import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Box, CircularProgress, Drawer } from '@mui/material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import { ApiResponse } from '../types/generalTypes'

type UploadPhotoDrawerProps = {
    open: boolean
    toggleDrawer: (
        open: boolean
    ) => (event: React.KeyboardEvent | React.MouseEvent) => void
    dragging: boolean
    setDragging: (dragging: boolean) => void
    file: File | null
    preview: string | null
    handleDrop: (event: React.DragEvent<HTMLDivElement>) => void
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    value: string
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    setFile: (file: File | null) => void
    setPreview: (preview: string | null) => void
}

const UploadPhotoDrawer: React.FC<UploadPhotoDrawerProps> = ({
    setFile,
    setPreview,
    open,
    toggleDrawer,
    dragging,
    setDragging,
    file,
    preview,
    handleDrop,
    handleFileChange,
    value,
    handleChange,
}) => {
    const [name, setName] = useState<string>('')

    const [familyMembers, setFamilyMembers] = useState<string[]>([])

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchFamilyMembers = async () => {
            try {
                const response = await axios.get<ApiResponse>(
                    `${process.env.NEXT_PUBLIC_API_URL}/family`
                )
                const members = response.data.data // Fix: accessing the correct array

                const uniqueNames = new Set<string>()
                members.forEach((member) => {
                    uniqueNames.add(member.name)
                    member.descendants.children?.forEach((child) =>
                        uniqueNames.add(child.name)
                    )
                    member.descendants.grandchildren?.forEach((grandchild) =>
                        uniqueNames.add(grandchild.name)
                    )
                    member.descendants.greatgrandchildren?.forEach(
                        (greatGrandchild) =>
                            uniqueNames.add(greatGrandchild.name)
                    )
                })

                setFamilyMembers([...uniqueNames])
            } catch (error) {
                console.error('Error fetching family members:', error)
            }
        }

        fetchFamilyMembers()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!file || !value || !name) {
            alert('Please upload a file, enter a name, and select a type')
            return
        }
        setLoading(true)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', name)
        formData.append('type', value)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/photos/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || 'Upload failed')
            } else {
                alert('Upload successful! ' + data.message)

                // Reset form fields
                setName('')
                setDragging(false)
                setFile(null)
                setPreview(null) // Reset preview

                toggleDrawer(false) // Close drawer immediately
            }
        } catch (error) {
            console.log('Upload error:', error)

            if (error instanceof Error) {
                alert(`Upload failed: ${error.message}`)
            } else {
                alert('An unknown error occurred')
            }
        } finally {
            setLoading(false) // Ensure loading state is reset
        }
    }

    return (
        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
            <Box
                sx={{
                    width: 300,
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
                role="presentation"
            >
                <form
                    className="flex flex-col gap-2 lg:gap-5"
                    onSubmit={handleSubmit}
                    action=""
                >
                    <h2 className="text-lg font-semibold mb-2">
                        Upload Your Photo
                    </h2>
                    <div
                        className={`py-[20px] flex flex-col md:flex-row justify-center items-center gap-[0.5rem] w-full border-[1px] rounded-[8px] border-appBrown2 outline-none bg-white placeholder:text-appGrey2 px-[15px] md:px-[20px] 
                        ${
                            dragging
                                ? 'border-dashed border-white'
                                : 'border-solid border-appBrown2'
                        }`}
                        onDragOver={(e) => {
                            e.preventDefault()
                            setDragging(true)
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center gap-[0.5rem] ">
                            <span className="md:w-[30px] w-[30px] h-[30px] md:h-[30px]">
                                <Image
                                    width={30}
                                    height={30}
                                    alt="upload"
                                    src="/upload.svg"
                                    className="h-full w-full object-contain"
                                />
                            </span>

                            <p className="text-appGrey2 font-light text-[13px] text-center">
                                {file
                                    ? `Selected: ${file.name}`
                                    : 'Drag and drop an image or click to upload'}
                            </p>

                            <label className="cursor-pointer button-home text-white text-[13px] py-2 px-6 rounded-md transition">
                                Select a File
                                <input
                                    type="file"
                                    name="image"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </label>
                        </div>

                        {preview && (
                            <div className="w-[100px] h-[100px] rounded-md overflow-hidden border border-appPurple">
                                <Image
                                    width={100}
                                    height={100}
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <FormControl>
                        <p className="text-appBrown2">Photo Type:</p>
                        <RadioGroup
                            name="photo-type"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value="historical"
                                control={<Radio />}
                                label="Historical"
                            />
                            <FormControlLabel
                                value="recentEvents"
                                control={<Radio />}
                                label="Recent Events"
                            />
                            <FormControlLabel
                                value="families"
                                control={<Radio />}
                                label="Families"
                            />
                            <FormControlLabel
                                value="single-photo"
                                control={<Radio />}
                                label="Single Photo"
                            />
                        </RadioGroup>
                    </FormControl>

                    <div className=" flex flex-col gap-1">
                        {value === 'single-photo' ? (
                            <Autocomplete
                                sx={{ width: '100%' }}
                                options={familyMembers}
                                value={name || ''}
                                onChange={(event, newValue) =>
                                    setName(newValue || '')
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Name"
                                        fullWidth
                                    />
                                )}
                            />
                        ) : (
                            <>
                                <label
                                    className="text-[16px] text-appBrown2"
                                    htmlFor=""
                                >
                                    Name
                                </label>

                                <input
                                    value={name || ''}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Input name of photo"
                                    className="w-full py-2 px-2 rounded-[16px]  border-[1px] border-appBrown2 flex bg-transparent text-appBrown2 outline-none placeholder:text-opacity-60 placeholder:text-appBrown2"
                                />
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        // onClick={toggleDrawer(false)}
                        className="bg-blue-500 text-white mt-3 lg:mt-[2rem] px-4 py-2 rounded-lg w-full"
                    >
                        {loading ? <CircularProgress size={24} /> : 'Upload'}
                    </button>
                </form>
            </Box>
        </Drawer>
    )
}

export default UploadPhotoDrawer

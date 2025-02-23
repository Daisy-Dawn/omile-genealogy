import React, { useState } from 'react'
import Image from 'next/image'
import { Box, Drawer } from '@mui/material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

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
}

const UploadPhotoDrawer: React.FC<UploadPhotoDrawerProps> = ({
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
    const [name, setName] = useState('')
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!file || !value || !name) {
            alert('Please upload a file, enter a name, and select a type')
            return
        }

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
            }

            alert('Upload successful!')

            setName('')
            setDragging(false)
        } catch (error) {
            console.log('Upload error:', error)

            // Ensure error is an instance of Error before accessing message
            if (error instanceof Error) {
                alert(`Upload failed: ${error.message}`)
            } else {
                alert('An unknown error occurred')
            }
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
                    className="flex flex-col gap-5"
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

                    <div className="mt-[0.5rem] flex flex-col gap-1">
                        <label
                            className="text-[16px] text-appBrown2"
                            htmlFor=""
                        >
                            Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Input name of photo"
                            className="w-full py-2 px-2 rounded-[16px]  border-[1px] border-appBrown2 flex bg-transparent text-appBrown2 outline-none placeholder:text-opacity-60 placeholder:text-appBrown2"
                        />
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
                        </RadioGroup>
                    </FormControl>

                    <button className="button-home text-white mt-[1rem] px-4 py-2 rounded-lg w-full">
                        Submit
                    </button>

                    <button
                        type="submit"
                        onClick={toggleDrawer(false)}
                        className="bg-blue-500 text-white mt-[2rem] px-4 py-2 rounded-lg w-full"
                    >
                        Close
                    </button>
                </form>
            </Box>
        </Drawer>
    )
}

export default UploadPhotoDrawer

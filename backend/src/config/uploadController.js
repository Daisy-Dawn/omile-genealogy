const cloudinary = require('cloudinary').v2
const multer = require('multer')
const dotenv = require('dotenv')
const Photo = require('../models/Photo')

dotenv.config()

// Fix Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Setup multer storage (stores file in memory)
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Function to upload to Cloudinary
const uploadToCloudinary = async (fileBuffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image', format: mimetype.split('/')[1] }, // Extract format
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error)
                    reject(error)
                } else {
                    console.log('Cloudinary Upload Success:', result.secure_url)
                    resolve(result.secure_url)
                }
            }
        )
        stream.end(fileBuffer)
    })
}

// Controller function to handle file upload and create a MongoDB document
const uploadPhoto = async (req, res) => {
    try {
        console.log('Received file:', req.file)

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }

        const { name, type } = req.body

        if (!name || !type) {
            return res
                .status(400)
                .json({ message: 'Name and type are required' })
        }

        // Upload image buffer to Cloudinary
        const imageUrl = await uploadToCloudinary(
            req.file.buffer,
            req.file.mimetype
        )

        // Save photo document in MongoDB
        const photo = new Photo({
            photourl: imageUrl,
            name,
            type,
        })

        await photo.save()

        res.status(201).json({ message: 'Upload successful', photo })
    } catch (error) {
        console.error('Upload Error:', error)
        res.status(500).json({ error: error.message })
    }
}

module.exports = { upload, uploadPhoto }

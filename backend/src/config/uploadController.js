// const cloudinary = require('cloudinary').v2
// const multer = require('multer')
// const dotenv = require('dotenv')
// const Photo = require('../models/Photo')
// const Person = require('../models/Person')

// dotenv.config()

// // Fix Cloudinary configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// // Setup multer storage (stores file in memory)
// const storage = multer.memoryStorage()
// const upload = multer({ storage })

// // Function to upload to Cloudinary
// const uploadToCloudinary = async (fileBuffer, mimetype) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             { resource_type: 'image', format: mimetype.split('/')[1] }, // Extract format
//             (error, result) => {
//                 if (error) {
//                     console.error('Cloudinary Upload Error:', error)
//                     reject(error)
//                 } else {
//                     console.log('Cloudinary Upload Success:', result.secure_url)
//                     resolve(result.secure_url)
//                 }
//             }
//         )
//         stream.end(fileBuffer)
//     })
// }

// // Controller function to handle file upload and create a MongoDB document
// const uploadPhoto = async (req, res) => {
//     try {
//         console.log('Received file:', req.file)

//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' })
//         }

//         const { name, type } = req.body

//         if (!name || !type) {
//             return res
//                 .status(400)
//                 .json({ message: 'Name and type are required' })
//         }

//         // Upload image buffer to Cloudinary
//         const imageUrl = await uploadToCloudinary(
//             req.file.buffer,
//             req.file.mimetype
//         )

//         // Save photo document in MongoDB
//         const photo = new Photo({ photourl: imageUrl, name, type })
//         await photo.save()

//         // If not "single-photo", return immediately after saving
//         if (type !== 'single-photo') {
//             return res.status(201).json({
//                 message: 'Upload successful and saved in photos collection',
//                 photo,
//             })
//         }

//         // Escape special characters for regex
//         const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

//         // Search for exact match in both the `name` field and `children` array
//         const persons = await Person.find({
//             $or: [
//                 { name: { $regex: new RegExp(`^${escapedName}$`, 'i') } }, // Direct match
//                 {
//                     'descendants.children.name': {
//                         $regex: new RegExp(`^${escapedName}$`, 'i'),
//                     },
//                 }, // Nested match
//             ],
//         })

//         console.log('Found persons:', persons) // Debugging output

//         if (persons.length === 0) {
//             return res.status(201).json({
//                 message:
//                     'Upload successful, but no matching family member found',
//                 photo,
//             })
//         }

//         // Loop through matching persons and update their profile pictures
//         for (let person of persons) {
//             let updateQuery = {}

//             // If main person matches
//             if (person.name.toLowerCase() === name.toLowerCase()) {
//                 updateQuery.picture = imageUrl
//             }

//             // Update picture in nested fields using arrayFilters
//             await Person.updateOne(
//                 { _id: person._id },
//                 {
//                     $set: {
//                         ...updateQuery,
//                         'descendants.children.$[child].picture': imageUrl,
//                         'descendants.grandchildren.$[grandchild].picture':
//                             imageUrl,
//                         'descendants.greatgrandchildren.$[greatgrandchild].picture':
//                             imageUrl,
//                     },
//                 },
//                 {
//                     arrayFilters: [
//                         {
//                             'child.name': {
//                                 $regex: new RegExp(`^${escapedName}$`, 'i'),
//                             },
//                         },
//                         {
//                             'grandchild.name': {
//                                 $regex: new RegExp(`^${escapedName}$`, 'i'),
//                             },
//                         },
//                         {
//                             'greatgrandchild.name': {
//                                 $regex: new RegExp(`^${escapedName}$`, 'i'),
//                             },
//                         },
//                     ],
//                 }
//             )
//         }

//         res.status(201).json({
//             message: 'Upload successful and family member updated',
//             photo,
//         })
//     } catch (error) {
//         console.error('Upload Error:', error)
//         res.status(500).json({ error: error.message })
//     }
// }

// module.exports = { upload, uploadPhoto }

const cloudinary = require('cloudinary').v2
const multer = require('multer')
const dotenv = require('dotenv')
const Photo = require('../models/Photo')
const Person = require('../models/Person')

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
        const photo = new Photo({ photourl: imageUrl, name, type })
        await photo.save()

        // If not "single-photo", return immediately after saving
        if (type !== 'single-photo') {
            return res.status(201).json({
                message: 'Upload successful and saved in photos collection',
                photo,
            })
        }

        // Escape special characters for regex
        const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

        // Search for exact match in both the `name` field and related fields
        const persons = await Person.find({
            $or: [
                { name: { $regex: new RegExp(`^${escapedName}$`, 'i') } }, // Direct match
                {
                    'descendants.marriedTo.name': {
                        $regex: new RegExp(`^${escapedName}$`, 'i'),
                    },
                }, // Spouse match
                {
                    'descendants.children.name': {
                        $regex: new RegExp(`^${escapedName}$`, 'i'),
                    },
                }, // Children
                {
                    'descendants.grandchildren.name': {
                        $regex: new RegExp(`^${escapedName}$`, 'i'),
                    },
                }, // Grandchildren
            ],
        })

        console.log('Found persons:', persons) // Debugging output

        if (persons.length === 0) {
            return res.status(201).json({
                message:
                    'Upload successful, but no matching family member found',
                photo,
            })
        }

        // Loop through matching persons and update their profile pictures
        for (let person of persons) {
            let updateQuery = {}

            // If main person matches
            if (person.name.toLowerCase() === name.toLowerCase()) {
                updateQuery.picture = imageUrl
            }

            await Person.updateMany(
                { name: { $regex: new RegExp(`^${escapedName}$`, 'i') } },
                { $set: { picture: imageUrl } }
            )

            // Update specific `marriedTo` person (match by name within the array)
            await Person.updateMany(
                {
                    'descendants.marriedTo.name': {
                        $regex: new RegExp(`^${escapedName}$`, 'i'),
                    },
                },
                {
                    $set: {
                        'descendants.marriedTo.$[spouse].picture': imageUrl,
                    },
                },
                {
                    arrayFilters: [
                        {
                            'spouse.name': {
                                $regex: new RegExp(`^${escapedName}$`, 'i'),
                            },
                        },
                    ],
                }
            )

            // Update specific `children` person (match by name within the array)
            await Person.updateMany(
                {
                    'descendants.children.name': {
                        $regex: new RegExp(`^${escapedName}$`, 'i'),
                    },
                },
                { $set: { 'descendants.children.$[child].picture': imageUrl } },
                {
                    arrayFilters: [
                        {
                            'child.name': {
                                $regex: new RegExp(`^${escapedName}$`, 'i'),
                            },
                        },
                    ],
                }
            )

            // Update specific `grandchildren` person (match by name within the array)
            await Person.updateMany(
                {
                    'descendants.grandchildren.name': {
                        $regex: new RegExp(`^${escapedName}$`, 'i'),
                    },
                },
                {
                    $set: {
                        'descendants.grandchildren.$[grandchild].picture':
                            imageUrl,
                    },
                },
                {
                    arrayFilters: [
                        {
                            'grandchild.name': {
                                $regex: new RegExp(`^${escapedName}$`, 'i'),
                            },
                        },
                    ],
                }
            )
        }

        res.status(201).json({
            message: 'Upload successful and family member updated',
            photo,
        })
    } catch (error) {
        console.error('Upload Error:', error)
        res.status(500).json({ error: error.message })
    }
}

module.exports = { upload, uploadPhoto }

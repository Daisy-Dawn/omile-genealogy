const express = require('express')
const Photo = require('../models/Photo')
const { validatePhoto } = require('../middlewares/validations')
const router = express.Router()

// CREATE: Add a new photo
router.post('/', validatePhoto, async (req, res) => {
    try {
        const { photourl, name } = req.body
        const photo = new Photo({ photourl, name })
        await photo.save()
        res.status(201).json({ message: 'Photo created successfully', photo })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// READ: Get all photos or filter by name
router.get('/', async (req, res) => {
    try {
        const { name } = req.query

        // Build the filter query
        const filter = {}
        if (name) {
            filter.name = { $regex: name, $options: 'i' } // Case-insensitive search
        }

        const photos = await Photo.find(filter) // Apply the filter
        res.status(200).json(photos)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// READ: Get a single photo by ID
router.get('/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
        if (!photo) return res.status(404).json({ message: 'Photo not found' })
        res.status(200).json(photo)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// UPDATE: Partially update a photo by ID
router.patch('/:id', async (req, res) => {
    try {
        const updates = req.body // Accept only the fields provided in the request
        const photo = await Photo.findByIdAndUpdate(
            req.params.id,
            { $set: updates }, // Use $set to update only specified fields
            { new: true, runValidators: true } // Return the updated document
        )
        if (!photo) return res.status(404).json({ message: 'Photo not found' })
        res.status(200).json({ message: 'Photo updated successfully', photo })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// DELETE: Delete a photo by ID
router.delete('/:id', async (req, res) => {
    try {
        const photo = await Photo.findByIdAndDelete(req.params.id)
        if (!photo) return res.status(404).json({ message: 'Photo not found' })
        res.status(200).json({ message: 'Photo deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router

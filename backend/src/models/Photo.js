const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema({
    photourl: { type: String, required: true }, // URL of the photo
    name: { type: String, required: true }, // Name of the photo
    type: {
        type: String,
        required: true,
        enum: ['historical', 'recentEvents', 'families'], // Restrict to specific values
    },
})

// Index on name and type
photoSchema.index({ name: 1 }, { type: 1 })

// Text index for searches on name and type
photoSchema.index({ name: 'text', type: 'text' })

const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo

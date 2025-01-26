const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema({
    photourl: { type: String, required: true }, // URL of the photo
    name: { type: String, required: true }, // Name of the photo
})

// Index on name
photoSchema.index({ name: 1 })

// Text index for searches on name
photoSchema.index({ name: 'text' })

const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo

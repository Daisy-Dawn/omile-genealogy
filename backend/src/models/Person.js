const mongoose = require('mongoose')

const spouseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Reference to the spouse
    name: { type: String, required: true }, // Name of the spouse
    picture: { type: String, default: '' }, // Picture URL of the spouse
})

const descendantSchema = new mongoose.Schema({
    marriedTo: { type: [spouseSchema], default: [] }, // Array of spouse objects
    children: [
        {
            name: { type: String, required: true },
            bio: { type: String, default: '' },
            picture: { type: String, default: '' },
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
        },
    ],
    grandchildren: [
        {
            name: { type: String, required: true },
            bio: { type: String, default: '' },
            picture: { type: String, default: '' },
            marriedTo: { type: [spouseSchema], default: [] }, // Updated structure for grandchildren
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
        },
    ],
    greatgrandchildren: [
        {
            name: { type: String, required: true },
            bio: { type: String, default: '' },
            picture: { type: String, default: '' },
            marriedTo: { type: [spouseSchema], default: [] }, // Updated structure for great-grandchildren
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
        },
    ],
})

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String, default: '' },
    picture: { type: String, default: '' },
    parent: { type: String, default: '' },
    descendants: { type: descendantSchema, default: () => ({}) },
})

// Index on name
personSchema.index({ name: 1 })

// Text index for searches on name and bio
personSchema.index({ name: 'text', bio: 'text' })

const Person = mongoose.model('Person', personSchema)

module.exports = Person

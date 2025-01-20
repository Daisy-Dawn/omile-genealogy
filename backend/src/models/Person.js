const mongoose = require('mongoose')

const descendantSchema = new mongoose.Schema({
    marriedTo: { type: [String], default: [] }, // spouses as an array of strings
    children: [
        {
            name: { type: String, required: true }, // Name of each child
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Reference to the child document
        },
    ],
    grandchildren: [
        {
            name: { type: String, required: true }, // Name of each grandchild
            bio: { type: String, default: '' }, // Bio of each grandchild
            picture: { type: String, default: '' }, // Picture URL of each grandchild
            marriedTo: { type: [String], default: [] }, // Spouses for grandchildren
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Reference to the grandchild document
        },
    ],
    greatgrandchildren: [
        {
            name: { type: String, required: true }, // Name of each great-grandchild
            bio: { type: String, default: '' }, // Bio of each great-grandchild
            picture: { type: String, default: '' }, // Picture URL of each great-grandchild
            marriedTo: { type: [String], default: [] }, // Spouses for great-grandchildren
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Reference to the great-grandchild document
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

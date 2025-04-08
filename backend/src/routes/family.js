const express = require('express')
const router = express.Router()
const Person = require('../models/Person')
const { validateFamilyMember } = require('../middlewares/validations')
const mongoose = require('mongoose')
// const cacheMiddleware = require('../middlewares/cache')

//Add a new family member
router.post('/', validateFamilyMember, async (req, res) => {
    try {
        const { name, descendants, parent } = req.body

        // Prepare descendants fields
        const marriedToArray = Array.isArray(descendants?.marriedTo)
            ? descendants.marriedTo.map((spouse) => ({
                  _id: spouse._id || new mongoose.Types.ObjectId(),
                  name: spouse.name,
                  picture: spouse.picture || '',
              }))
            : []

        const children =
            descendants?.children?.map((child) => ({
                name: child,
                bio: child.bio || '', // Default bio for grandchildren
                picture: child.picture || '', // Default picture for grandchildren
                _id: new mongoose.Types.ObjectId(),
            })) || []

        const grandchildren =
            descendants?.grandchildren?.map((grandchild) => ({
                name: grandchild.name,
                bio: grandchild.bio || '', // Default bio for grandchildren
                picture: grandchild.picture || '', // Default picture for grandchildren
                marriedTo: grandchild.marriedTo || [], // Default `marriedTo` for grandchildren
                _id: new mongoose.Types.ObjectId(),
            })) || []

        const greatgrandchildren =
            descendants?.greatgrandchildren?.map((greatgrandchild) => ({
                name: greatgrandchild.name,
                bio: greatgrandchild.bio || '', // Default bio for greatgrandchildren
                picture: greatgrandchild.picture || '', // Default picture for greatgrandchildren
                _id: new mongoose.Types.ObjectId(),
            })) || []

        // Create the new person
        const newPerson = new Person({
            name,
            parent,
            descendants: {
                marriedTo: marriedToArray,
                children,
                grandchildren,
                greatgrandchildren,
            },
        })

        await newPerson.save()

        res.status(201).json({
            message: 'Family added successfully',
            data: newPerson,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get all family members
router.get('/', async (req, res) => {
    const { page = 1, limit = 20 } = req.query
    const sanitizedPage = Math.max(1, parseInt(page))
    const sanitizedLimit = Math.max(1, Math.min(100, parseInt(limit)))

    const filters = {}

    // Only include filters that are not 'page' and 'limit'
    // Loop over query parameters and apply as filters, handling dot notation for nested fields
    Object.keys(req.query).forEach((key) => {
        if (key !== 'page' && key !== 'limit') {
            let value = req.query[key].trim()

            // Escape special characters in regex
            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

            filters[key] = { $regex: value, $options: 'i' } // Case-insensitive search
        }
    })

    console.log('Filters applied:', filters)

    try {
        // Query the database with the filters
        const familyMembers = await Person.find(filters)
            // .skip((sanitizedPage - 1) * sanitizedLimit)
            // .limit(Number(sanitizedLimit))
            .populate('descendants.marriedTo')
            .populate('descendants.children')
            .populate('descendants.grandchildren')
        // .populate('descendants.greatgrandchildren')

        const totalRecords = await Person.countDocuments()

        // Cache the result
        // const cacheData = { totalRecords, totalPages, data }
        // client.setex(
        //     `familyMembers:${sanitizedPage}:${sanitizedLimit}`,
        //     3600,
        //     JSON.stringify(cacheData)
        // )

        res.status(200).json({
            // sanitizedPage,
            // sanitizedLimit,
            totalRecords,
            // totalPages: Math.ceil(totalRecords / sanitizedLimit),
            data: familyMembers,
            count: familyMembers.length,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get a family member by id
router.get('/:id', async (req, res) => {
    const { id } = req.params
    const { depth = 1 } = req.query

    const populateOptions = []
    if (depth >= 1) populateOptions.push({ path: 'descendants.children' })
    if (depth >= 2) populateOptions.push({ path: 'descendants.grandchildren' })
    if (depth >= 3)
        populateOptions.push({ path: 'descendants.greatgrandchildren' })

    try {
        // Search by _id and populate descendants based on populate options
        const familyMember = await Person.findById(id)
            .populate(populateOptions)
            .exec()

        if (!familyMember) {
            return res.status(404).json({ message: 'Family member not found' })
        }

        res.status(200).json({
            message: 'Family member found',
            data: familyMember,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get a single family member by name
router.get('/:name', async (req, res) => {
    try {
        const person = await Person.findOne({ name: req.params.name })
            .populate('descendants.children', '_id name') // Only return _id and name for children
            .populate('descendants.grandchildren', '_id name')
            .populate('descendants.greatgrandchildren', '_id name')

        if (!person) {
            return res.status(404).json({ message: 'Person not found' })
        }

        res.json(person)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//get number of descendants by a particular family member
router.get('/:id/descendant-summary', async (req, res) => {
    const { id } = req.params

    try {
        const summary = await Person.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(id) } },
            {
                $project: {
                    _id: 0,
                    totalChildren: { $size: '$descendants.children' },
                    totalGrandchildren: { $size: '$descendants.grandchildren' },
                    totalGreatGrandchildren: {
                        $size: '$descendants.greatgrandchildren',
                    },
                },
            },
        ])

        res.status(200).json({
            message: 'Summary fetched successfully',
            data: summary,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Update a family member
router.patch('/:id', validateFamilyMember, async (req, res) => {
    try {
        const { name, bio, descendants } = req.body

        const existingPerson = await Person.findById(req.params.id)
        if (!existingPerson) {
            return res.status(404).json({ message: 'Person not found' })
        }

        existingPerson.name = name
        existingPerson.bio = bio

        // Update marriedTo list
        existingPerson.descendants.marriedTo = descendants.marriedTo.map(
            (spouse, index) => ({
                ...existingPerson.descendants.marriedTo[index],
                name: spouse.name,
                picture: spouse.picture || '',
            })
        )

        // Update children list
        existingPerson.descendants.children = descendants.children.map(
            (child, index) => ({
                ...existingPerson.descendants.children[index],
                name: child.name,
                bio: child.bio || '',
                picture: child.picture || '',
            })
        )

        await existingPerson.save()

        res.json({
            message: 'Family updated successfully!',
            data: existingPerson,
        })
    } catch (error) {
        console.error('Error updating family:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// router.put('/:id', validateFamilyMember, async (req, res) => {
//     try {
//         const updateData = req.body

//         // Handle descendants transformation if provided
//         if (updateData.descendants) {
//             updateData.descendants = {
//                 ...existingPerson.descendants, // Preserve existing data
//                 ...updateData.descendants, // Override only provided fields
//             }

//             if (updateData.descendants.marriedTo) {
//                 updateData.descendants.marriedTo =
//                     updateData.descendants.marriedTo.map((spouse) => ({
//                         _id: spouse._id || new mongoose.Types.ObjectId(),
//                         name: spouse.name,
//                         picture:
//                             spouse.picture !== undefined &&
//                             spouse.picture !== null
//                                 ? spouse.picture
//                                 : existingPerson.descendants?.marriedTo?.find(
//                                       (s) => s._id.toString() === spouse._id
//                                   )?.picture || '',
//                     }))
//             }

//             if (updateData.descendants.children) {
//                 updateData.descendants.children =
//                     updateData.descendants.children.map((child) => ({
//                         _id: child._id || new mongoose.Types.ObjectId(),
//                         name: child.name,
//                         bio:
//                             child.bio !== undefined && child.bio !== null
//                                 ? child.bio
//                                 : existingPerson.descendants?.children?.find(
//                                       (c) => c._id.toString() === child._id
//                                   )?.bio || '',
//                         picture:
//                             child.picture !== undefined &&
//                             child.picture !== null
//                                 ? child.picture
//                                 : existingPerson.descendants?.children?.find(
//                                       (c) => c._id.toString() === child._id
//                                   )?.picture || '',
//                     }))
//             }
//         }

//         // Perform the update
//         const existingPerson = await Person.findById(req.params.id)
//         if (!existingPerson) {
//             return res.status(404).json({ message: 'Family not found' })
//         }

//         // Merge existing data with new data (update only provided fields)
//         const updatedPerson = await Person.findByIdAndUpdate(
//             req.params.id,
//             { $set: updateData }, // Only update provided fields
//             { new: true, runValidators: true }
//         )

//         if (!updatedPerson) {
//             return res.status(404).json({ message: 'Family not found' })
//         }

//         res.status(200).json({
//             message: 'Family updated successfully',
//             data: updatedPerson,
//         })
//     } catch (err) {
//         res.status(500).json({ error: err.message })
//     }
// })

// Delete a family member
router.delete('/:id', async (req, res) => {
    try {
        const deletedPerson = await Person.findByIdAndDelete(req.params.id)
        if (!deletedPerson)
            return res.status(404).json({ message: 'Family not found' })
        res.status(200).json({ message: 'Family deleted' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router

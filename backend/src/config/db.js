const mongoose = require('mongoose')
const Person = require('../models/Person')

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)

        console.log(
            `MongoDB Connected successfully: ${connect.connection.host}`
        )

        // // Update all documents to include `marriedTo`, `bio`, and `picture` in grandchildren
        // const grandchildrenUpdate = await Person.updateMany(
        //     { 'descendants.grandchildren': { $exists: true } },
        //     {
        //         $set: {
        //             'descendants.grandchildren.$[].bio': '',
        //             'descendants.grandchildren.$[].picture': '',
        //             'descendants.grandchildren.$[].marriedTo': [],
        //         },
        //     }
        // )

        // console.log(
        //     `Grandchildren migration completed. Updated ${grandchildrenUpdate.modifiedCount} documents.`
        // )

        // // Update all documents to include `bio` and `picture` in greatgrandchildren
        // const greatGrandchildrenUpdate = await Person.updateMany(
        //     { 'descendants.greatgrandchildren': { $exists: true } },
        //     {
        //         $set: {
        //             'descendants.greatgrandchildren.$[].bio': '',
        //             'descendants.greatgrandchildren.$[].picture': '',
        //             'descendants.greatgrandchildren.$[].marriedTo': '',
        //         },
        //     }
        // )

        // console.log(
        //     `Great-grandchildren migration completed. Updated ${greatGrandchildrenUpdate.modifiedCount} documents.`
        // )
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB

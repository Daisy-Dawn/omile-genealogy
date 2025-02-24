const mongoose = require('mongoose')
// const Person = require('../models/Person')
// const Photo = require('../models/Photo')

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)

        console.log(
            `MongoDB Connected successfully: ${connect.connection.host}`
        )
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB

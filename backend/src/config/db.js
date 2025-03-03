const mongoose = require('mongoose')
const Person = require('../models/Person')

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(
            `MongoDB Connected successfully: ${connect.connection.host}`
        )

        // Find all documents where descendants.marriedTo contains affected names
        // const affectedDocs = await Person.find({
        //     'descendants.marriedTo.name': { $type: 'string', $regex: /^{\n/ },
        // })

        // console.log(`Found ${affectedDocs.length} affected documents`)

        // for (const doc of affectedDocs) {
        //     for (let i = 0; i < doc.descendants.marriedTo.length; i++) {
        //         let spouse = doc.descendants.marriedTo[i]
        //         if (spouse.name && /^{\n/.test(spouse.name)) {
        //             try {
        //                 const matches = spouse.name.match(/'(\d+)':\s'(.+?)'/g)
        //                 if (!matches) continue

        //                 const fixedName = matches
        //                     .map((m) => m.match(/'(\d+)':\s'(.+?)'/))
        //                     .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
        //                     .map((m) => m[2])
        //                     .join('')

        //                 console.log(
        //                     `Fixing name for ${spouse._id}: ${fixedName}`
        //                 )

        //                 // Update only the specific field instead of the whole array
        //                 await Person.updateOne(
        //                     {
        //                         _id: doc._id,
        //                         'descendants.marriedTo._id': spouse._id,
        //                     },
        //                     {
        //                         $set: {
        //                             'descendants.marriedTo.$.name': fixedName,
        //                         },
        //                     }
        //                 )

        //                 console.log(
        //                     `Updated name for ${spouse._id} in ${doc._id}`
        //                 )
        //             } catch (error) {
        //                 console.error(
        //                     `Error processing spouse ${spouse._id}:`,
        //                     error
        //                 )
        //             }
        //         }
        //     }
        // }

        // console.log('All affected names in marriedTo have been fixed.')
        // mongoose.connection.close()
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB

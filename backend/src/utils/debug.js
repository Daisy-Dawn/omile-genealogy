const mongoose = require('mongoose')

mongoose.set('debug', (collectionName, method, query, doc) => {
    console.log(
        `[Mongoose] ${collectionName}.${method} - Query: ${JSON.stringify(
            query
        )} - Doc: ${JSON.stringify(doc)}`
    )
})

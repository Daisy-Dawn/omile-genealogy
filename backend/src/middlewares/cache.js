// const client = require('../config/cache')

// const cacheMiddleware = async (req, res, next) => {
//     const key = req.originalUrl

//     try {
//         // Check if data is in cache
//         const cachedData = await client.get(key)

//         if (cachedData) {
//             // If data is cached, return it directly
//             return res.status(200).json(JSON.parse(cachedData))
//         }

//         // If no cache, override res.json method
//         res.sendResponse = res.json
//         res.json = (body) => {
//             // Cache the response for 3 days (60 * 60 * 24 * 3)
//             client.set(key, JSON.stringify(body), { EX: 60 * 60 * 24 * 3 })
//             res.sendResponse(body)
//         }

//         // Continue to the next middleware/route handler
//         next()
//     } catch (err) {
//         console.error(err)
//         next() // Call next to ensure the app doesn't break
//     }
// }

// module.exports = cacheMiddleware

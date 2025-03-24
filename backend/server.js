const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./src/config/db')
const cors = require('cors')
const familyRoutes = require('./src/routes/family')
const photoRoutes = require('./src/routes/photos')
require('./src/utils/debug')

dotenv.config()
connectDB()

const app = express()

app.use(cors())

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    cors({
        origin: '*', // Allows all origins
        credentials: true, // Allows credentials (optional)
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)

// Routes
app.use('/api/family', familyRoutes)
app.use('/api/photos', photoRoutes)
app.get('/', (req, res) => {
    res.send('Backend is running!')
})

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

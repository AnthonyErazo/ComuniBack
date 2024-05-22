const express = require('express')
const appRouter = require('./routes')
const { connectDb } = require('./config')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { configObject } = require('./config/configObject')


const app = express()
const PORT = configObject.PORT

// app.use(cors({
//     origin: [configObject.FRONT_URL],
//     methods: ["GET", "POST","PUT","DELETE"],
//     credentials: true
// }))

connectDb()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(appRouter)

app.listen(PORT, err => {
    if (err) console.error(err)
    console.log(`Escuchando en el puerto ${PORT}`)
})

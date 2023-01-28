import express from "express"
import cors from "cors"
import userRouter from './routes/user'

const app = express()

app.use(cors({origin: ['http://localhost:3000']}))

console.log("Server Started!")

// const router = require('./routes/route')
// app.use('/path', router)
userRouter("/user", app)
//userRouter(app)
app.listen(3001)
import express from "express"
import cors from "cors"
import {router as userRouter} from './routes/user'
import {router as taskRouter} from './routes/task'
import 'dotenv/config'

const app = express()
app.use(express.json())
app.use(cors({origin: ['http://localhost:3000']}))

console.log("Server Started!")

// const router = require('./routes/route')
// app.use('/path', router)
app.use("/user" , userRouter)
app.use("/task" , taskRouter)
//userRouter(app)
app.listen(3001)
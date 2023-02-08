import express from "express"
import cors from "cors"
import {router as userRouter} from './routes/user'
import {router as taskRouter} from './routes/task'
import {router as categoryRouter} from './routes/category'
import 'dotenv/config'

const app = express()
app.use(cors({origin: true, credentials: true}))
app.use(express.json())

console.log("Server Started!")

// const router = require('./routes/route')
// app.use('/path', router)
app.use("/user" , userRouter)
app.use("/task" , taskRouter)
app.use("/category" , categoryRouter)
//userRouter(app)
app.listen(3001)
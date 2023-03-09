import { Router, Request, Response } from "express"
import { v1 as uuidv1 } from "uuid"
import bcrypt from "bcrypt"
import mysql from 'mysql2/promise'

const router = Router()

router.post("/add", async (req: Request, res: Response) => {  // ADD USER
    if (req.body == null || req.body.password == null || req.body.username == null || req.body.email == null) {
        res.status(403).json({ error: "Bad Request Body" })
        return
    }

    const query = `
        INSERT INTO USER(id, name, email, password, creation_date, refresh_token)
        VALUES ('${uuidv1()}', '${req.body.username}', '${req.body.email}', '${await bcrypt.hash(req.body.password, 10)}', UTC_TIMESTAMP, NULL)
        `

    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
        await connection.query(query)
        res.status(200).json({ messsage: "User created with success" })
        return
    }
    catch (err) {
        console.log(err)
        res.status(503).json({ error: "Server Error" })
        return
    }
})


router.post("/login", async (req: Request, res: Response) => {  // LOGIN USER
    if (req.body == null || req.body.password == null || (req.body.username == null && req.body.email == null) || (req.body.username != null && req.body.email != null)) {
        res.status(403).json({ error: "Bad Request Body" })
        return
    }

    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
        if (req.body.username != null) //login with username
        {
            const username_query = `
                SELECT id, email, password, name, creation_date
                FROM USER
                WHERE name='${req.body.username}'
                `
            let db_res = await connection.query(username_query)
            //@ts-ignore
            if (db_res[0].length !== 1) {
                res.status(200).json({ message: "User doesnt exist" })
                return
            }
            //@ts-ignore
            let db_password = db_res[0][0].password
            if ((await bcrypt.compare(req.body.password, db_password)) === true)//@ts-ignore
                res.status(200).json({ message: "User logged with success", user_data: { id: db_res[0][0].id, name: db_res[0][0].name, email: db_res[0][0].email, creation_date: db_res[0][0].creation_date } })
            else
                res.status(200).json({ message: "Wrong password" })
            return
        }
        else //login with email
        {
            const email_query = `
                SELECT id, email, password, name, creation_date
                FROM USER
                WHERE email='${req.body.email}'
                `
            let db_res = await connection.query(email_query)
            //@ts-ignore
            if (db_res[0].length !== 1) {
                res.status(200).json({ message: "User doesnt exist" })
                return
            }
            //@ts-ignore
            let db_password = db_res[0][0].password
            if ((await bcrypt.compare(req.body.password, db_password)) === true)//@ts-ignore
                res.status(200).json({ message: "User logged with success", user_data: { id: db_res[0][0].id, name: db_res[0][0].name, email: db_res[0][0].email, creation_date: db_res[0][0].creation_date } })
            else
                res.status(200).json({ message: "Wrong password" })
            return
        }
    }
    catch (err) {
        console.log(err)
        res.status(503).json({ error: "Server Error" })
        return
    }

})



export { router }

/*
saturday push       saturday chest triceps
sunday pull         sunday   back biceps
monday legs         monday   legs shoulders
tuesday rest        tuesday  rest
wednesday push      wednesday chest triceps
thursday pull       thursday  back biceps
friday rest         friday    rest

*/
import {Router, Request, Response} from "express"
import {v1 as uuidv1} from "uuid"
import bcrypt from "bcrypt"
import mysql from 'mysql2/promise'

const router = Router()

    router.post("/add", async(req:Request, res:Response)=>{  // ADD USER
        if(req.body == null || req.body.password == null || req.body.username == null || req.body.email == null)
        {
            res.status(403).json({error: "Bad Request Body"})
            return
        }

        const query = `
        INSERT INTO USER(id, name, email, password, creation_date, refresh_token)
        VALUES (${uuidv1()}, ${req.body.email}, ${bcrypt.hash(req.body.password, 10)}, UTC_TIMESTAMP, NULL)
        `
        const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
        try
        {
            await connection.query(query)
            res.status(200).json({messsage: "User created with success"})
        }
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
        }
    })



export {router}
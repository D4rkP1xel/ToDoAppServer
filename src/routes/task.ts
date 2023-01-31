import {Router, Request, Response} from "express"
import {v1 as uuidv1} from "uuid"
import mysql from 'mysql2/promise'
const router = Router()

router.post("/add", async(req:Request, res:Response)=>{  // ADD TASK
    if(req.body == null || req.body.task_name == null || req.body.task_date == null || req.body.user_id == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
        const query = `
        INSERT INTO TASK(id, name, date, user_id, is_done)
        VALUES ('${uuidv1()}', '${req.body.name}', '${req.body.date}', '${req.body.user_id}', -1)
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({messsage: "Task added with success"})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }

  })

  router.post("/remove", async(req:Request, res:Response)=>{  // REMOVE TASK
    if(req.body == null || req.body.task_id == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
        const query = `
        DELETE
        FROM TASK
        WHERE id='${req.body.task_id}'
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({messsage: "Task removed with success"})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }

  })

  router.post("/changename", async(req:Request, res:Response)=>{  //CHANGE NAME OF TASK
    if(req.body == null || req.body.task_id == null || req.body.task_name == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
        const query = `
        UPDATE TASK
        SET name='${req.body.task_name}'
        WHERE id='${req.body.task_id}'
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({messsage: "Task Name updated with success"})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }

  })

  router.post("/changedone", async(req:Request, res:Response)=>{  //CHANGE is_done OF TASK
    if(req.body == null || req.body.task_id == null || req.body.is_done == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
        const query = `
        UPDATE TASK
        SET is_done='${req.body.is_done}'
        WHERE id='${req.body.task_id}'
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({messsage: "Task Done Status updated with success"})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }

  })
export {router}
import {Router, Request, Response} from "express"
import {v1 as uuidv1} from "uuid"
import mysql from 'mysql2/promise'
const router = Router()

router.post("/get", async(req:Request, res:Response)=>{
    if(req.body == null || req.body.user_id == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
    const query = `
        SELECT id, name
        FROM CATEGORY
        WHERE user_id='${req.body.user_id}'
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            const data = await connection.query(query)
            res.status(200).json({message: "Categories delivered with success", categories: data[0]})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }
})

router.post("/add", async(req:Request, res:Response)=>{
    if(req.body == null || req.body.user_id == null || req.body.category_name == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
    const query = `
        INSERT
        INTO CATEGORY(id, name, user_id)
        VALUES('${uuidv1()}', '${req.body.category_name}', '${req.body.user_id}')
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({message: "Category added with success"})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }
})

router.post("/remove", async(req:Request, res:Response)=>{
    if(req.body == null || req.body.user_id == null || req.body.category_name == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
    const query = `
        DELETE
        FROM CATEGORY
        WHERE name='${req.body.category_name}' AND user_id='${req.body.user_id}'
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({message: "Category removed with success"})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }
})

router.post("/rename", async(req:Request, res:Response)=>{ //NOT IMPLEMENTED ON THE FRONTEND, possible idea is when holding the category name, show an option to change its name
    if(req.body == null || req.body.user_id == null || req.body.new_category_name == null || req.body.old_category_name == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
    const query = `
        UPDATE CATEGORY
        SET name='${req.body.new_category_name}'
        WHERE name='${req.body.old_category_name}' AND user_id='${req.body.user_id}'
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({message: "Category renamed with success"})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }
})

router.post("/getPerformance", async(req:Request, res:Response)=>{
    if(req.body == null || req.body.user_id == null ||  req.body.category_name == null || req.body.type == null || (req.body.type !== "monthly" && req.body.type !== "daily" && req.body.type !== "weekly"))
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
    let query 
    
    if(req.body.type === "monthly")
    {
        query = `
        SELECT DATE_FORMAT(date, '%Y-%m') AS date, SUM(task_time) as total_time
        FROM TASK
        WHERE date >= DATE_SUB(DATE_FORMAT(CURDATE(),'%Y-%m-01'),INTERVAL 1 YEAR) 
        AND user_id='${req.body.user_id}' 
        AND task_category_name='${req.body.category_name}'
        GROUP BY DATE_FORMAT(date, '%Y-%m')
        ORDER BY DATE_FORMAT(date, '%Y-%m')
        `
    }
    else if(req.body.type === "weekly") //NOT DONE
    {
        query = `
        SELECT DATE_FORMAT(date, '%Y-%m') AS date, SUM(task_time) as total_time
        FROM TASK
        WHERE date >= DATE_SUB(DATE_FORMAT(CURDATE(),'%Y-%m-01'),INTERVAL 1 YEAR) 
        AND user_id='${req.body.user_id}' 
        AND task_category_name='${req.body.category_name}'
        GROUP BY DATE_FORMAT(date, '%Y-%m')
        `
    }
    else //DAILY
    {
        query = `
        SELECT DATE_FORMAT(date, '%Y-%m') AS date, SUM(task_time) as total_time
        FROM TASK
        WHERE date >= DATE_SUB(DATE_FORMAT(CURDATE(),'%Y-%m-01'),INTERVAL 1 YEAR) 
        AND user_id='${req.body.user_id}' 
        AND task_category_name='${req.body.category_name}'
        GROUP BY DATE_FORMAT(date, '%Y-%m')
        `
    }
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            const tasks = (await connection.query(query))[0]
            res.status(200).json({message: "Success", tasks: tasks})
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
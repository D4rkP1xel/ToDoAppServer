import {Router, Request, Response} from "express"
import {v1 as uuidv1} from "uuid"
import mysql from 'mysql2/promise'
const router = Router()

router.post("/get",  async(req:Request, res:Response)=>{ //GET SINGLE TASK
    if(req.body == null || req.body.user_id == null || req.body.date == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
    const query = `
        SELECT *
        FROM TASK
        WHERE user_id='${req.body.user_id}' AND DATEDIFF('${req.body.date}', TASK.date)=0
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            const data = await connection.query(query)
            res.status(200).json({message: "Task(s) retrived with success", tasks: data[0]})
            return
        }
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }
})

router.post("/getMonthPerformance",  async(req:Request, res:Response)=>{ //GET SUCCESSFUL DAYS

    if(req.body == null || req.body.user_id == null || req.body.date == null) //date must be in this format -> "2023-02"
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
    
    const query = `
    SELECT date, is_done 
    FROM TASK 
    WHERE user_id='${req.body.user_id}' 
    AND SUBSTRING(date, 1,7)='${req.body.date}'
    `
    try
    {
        const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
        const data:any = (await connection.query(query))[0]
      
        if(data.length === 0) 
        {res.status(200).json({data: {}})
        return
    }
        let result:any = {}
        data.map((obj: {date: Date , is_done: number})=>{
            let dateAux = `${obj.date.getUTCFullYear()}-${(obj.date.getUTCMonth() +1).toString().padStart(2, '0')}-${(obj.date.getUTCDate()).toString().padStart(2, '0')}`
            if(result[dateAux] == null) result[dateAux] = {num_tasks: 1, tasks_done : obj.is_done === 1 ? 1 : 0, tasks_half_done: obj.is_done === 0 ? 1 : 0, tasks_not_done: obj.is_done === -1 ? 1 : 0  }
            else
            {
                result[dateAux].num_tasks++
                if(obj.is_done === 1) result[dateAux].tasks_done++
                else if(obj.is_done === 0)result[dateAux].tasks_half_done++
                else if(obj.is_done === -1)result[dateAux].tasks_not_done++
            }
        })
        
        Object.keys(result).forEach((key)=>{
            let obj = result[key]
            if(obj.num_tasks === obj.tasks_done)  result[key] = {selected: true,selectedColor: "#10b981",selectedTextColor: "white"}
            else if(obj.tasks_done>0 || obj.tasks_half_done>0) result[key] = {selected: true,selectedColor: "#fbbf24",selectedTextColor: "white"}
            else delete result[key]
        })
        //console.log(result)
        res.status(200).json({data: result})
        return
    }
    catch(err)
    {
        console.log(err)
        res.status(503).json({error: "Server Error"})
        return
    }
})
router.post("/add", async(req:Request, res:Response)=>{  // ADD TASK
    
    if(req.body == null || req.body.task_name == null || req.body.task_date == null || req.body.user_id == null || req.body.is_done == null || req.body.category_name == null || req.body.task_time == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
    //console.log(req.body)
        const query = `
        INSERT INTO TASK(id, name, date, user_id, is_done, task_category_name, task_time)
        VALUES ('${uuidv1()}', '${req.body.task_name.trim()}', DATE("${req.body.task_date}"), '${req.body.user_id}', ${req.body.is_done}, '${req.body.category_name}', ${req.body.task_time})
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({message: "Task added with success"})
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
            res.status(200).json({message: "Task removed with success"})
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
            res.status(200).json({message: "Task Name updated with success"})
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
            res.status(200).json({message: "Task Done Status updated with success"})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }

  })

  router.post("/changeCategory", async(req:Request, res:Response)=>{  //CHANGE task_category_name OF TASK
    if(req.body == null || req.body.task_id == null || req.body.task_category_name == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
        const query = `
        UPDATE TASK
        SET task_category_name='${req.body.task_category_name}'
        WHERE id='${req.body.task_id}'
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({message: "Task category updated with success"})
            return
        }
        
        catch(err)
        {
            console.log(err)
            res.status(503).json({error: "Server Error"})
            return
        }

  })

  router.post("/changeTaskTime", async(req:Request, res:Response)=>{  //CHANGE task_time OF TASK
    if(req.body == null || req.body.task_id == null || req.body.task_time == null)
    {
        res.status(403).json({error: "Bad Request Body"})
        return
    }
    
        const query = `
        UPDATE TASK
        SET task_time='${req.body.task_time}'
        WHERE id='${req.body.task_id}'
        `
        try
        {
            const connection = await mysql.createConnection(process.env.DATABASE_URL || '')
            await connection.query(query)
            res.status(200).json({message: "Task Time updated with success"})
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
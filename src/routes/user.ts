import {Express} from "express"
import {v1 as uuidv1} from "uuid"

function routes(path:string ,app: Express)
{
    app.get(path + "/", (req, res)=>{
        return res.send("yoo")
    })
}


export default routes
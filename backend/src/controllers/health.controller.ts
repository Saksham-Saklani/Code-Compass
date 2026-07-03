import type { Request, Response } from "express";

function checkHealth(req: Request, res: Response){
    res.json({
        message: "ok",
        service: "Code Compass API"
    })
}

export {checkHealth};
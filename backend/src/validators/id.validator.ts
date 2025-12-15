import { Request, Response } from "express";

export function idIsNan(id: number, res: Response){
    if(isNaN(id)){
        res.status(400).send("Nem megfelelő formátumú azonosító.");
        return;
    };
};

export function bodyIsUndefined(req: Request, res: Response){
    if(!req.body){
        res.status(400).send("Nem küldte el az adatokat.");
        return;
    };
};
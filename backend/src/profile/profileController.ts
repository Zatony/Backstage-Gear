import datas from "./data";
import { Request, Response } from "express";


export function getProfileDatasById(req: Request, res: Response){
    const userName: string = req.params.userName;

    const userResult = datas.some(u => u.userName === userName);
    if(!userResult){
        res.status(404).send("Ez a felhasználó még nem létezik.");
        return;
    };

    const result = datas.find(p => p.userName === userName);
    if(result){
        res.status(200).send(result);
        return;
    };

    res.status(404).send("Nem található ilyen elem.");
};
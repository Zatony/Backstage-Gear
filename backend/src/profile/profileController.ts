import datas from "./data";
import { Request, Response } from "express";


function idIsNan(id: number, res: Response){
    if(isNaN(id)){
        res.status(400).send("Nem megfelelő formátumú azonosító.");
        return;
    };
};


export function getProfileDatasById(req: Request, res: Response){
    const id: number = parseInt(req.params.profileId);
    idIsNan(id, res);

    const result = datas.find(p => p.profileId === id);

    if(result){
        res.status(200).send(result);
        return;
    };

    res.status(404).send("Nem található ilyen elem.");
};
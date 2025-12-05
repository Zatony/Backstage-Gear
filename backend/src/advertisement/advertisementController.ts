import { Request, Response } from "express";
import datas from "./data";


function idIsNan(id: number, res: Response){
    if(isNaN(id)){
        res.status(400).send("Nem megfelelő formátumú azonosító.");
        return;
    };
};


export function getAds(_req: Request, res: Response){
    res.status(200).send(datas);
};


export function getAdDatasById(req: Request, res: Response){
    const id: number = parseInt(req.params.adId);
    idIsNan(id, res);

    const result = datas.find(a => a.adId === id);

    if(result){
        res.status(200).send(result);
        return;
    };

    res.status(404).send("Nincs ilyen azonosítójú elem.");
};
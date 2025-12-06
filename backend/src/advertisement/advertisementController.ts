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


export function getUserAds(req: Request, res: Response){
    const userName: string = req.params.userName;

    const userResult = datas.some(u => u.userName === userName);
    if(!userResult){
        res.status(404).send("Ez a felhasználó még nem töltött fel hirdetéseket vagy nem létezik.");
        return;
    };

    const results = datas.filter(i => i.userName === userName);
    if(results.length > 0){
        res.status(200).send(results);
        return;
    };

    res.status(400).send("Nincsenek még hirdetések.");
};


export function getUserAdById(req: Request, res: Response){
    const userName: string = req.params.userName;
    const adId: number = parseInt(req.params.adId);

    idIsNan(adId, res);

    const userResult = datas.some(u => u.userName === userName);
    if(!userResult){
        res.status(404).send("Nem létezik ilyen felhasználó.");
        return;
    };

    const results = datas.find(i => i.userName === userName && i.adId === adId);
    if(results){
        res.status(200).send(results);
        return;
    };

    res.status(400).send("Nem létezik ilyen hirdetés.");
};
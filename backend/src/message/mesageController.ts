import { Request, Response } from "express";
import datas from "./data";


function idIsNan(id: number, res: Response){
    if(isNaN(id)){
        res.status(400).send("Nem megfelelő formátumú azonosító.");
        return;
    };
};


export function getUserIncomingMessages(req: Request, res: Response){
    const userName: string = req.params.userName;

    const userResult = datas.some(u => u.receiver === userName);
    if(!userResult){
        res.status(404).send("Ez a felhasználó még nem kapott üzeneteket vagy nem létezik.");
        return;
    };

    const results = datas.filter(m => m.receiver === userName);
    if(results.length > 0){
        res.status(200).send(results);
        return;
    };

    res.status(400).send("Nincsenek beérkező üzenetek.");
};


export function getUserIcomingMessageById(req: Request, res: Response){
    const userName: string = req.params.userName;
    const messageId: number = parseInt(req.params.messageId);

    idIsNan(messageId, res);

    const userResult = datas.some(u => u.receiver === userName);
    if(!userResult){
        res.status(404).send("Ez a felhasználó még nem kapott üzeneteket vagy nem létezik.");
        return;
    };

    const results = datas.filter(m => m.receiver === userName && m.messageId === messageId);
    if(results.length > 0){
        res.status(200).send(results);
        return;
    };

    res.status(400).send("Nem létezik ilyen azonosítójú elem.");
};


export function getUserSentMessages(req: Request, res: Response){
    const userName: string = req.params.userName;

    const userResult = datas.some(u => u.sender === userName);
    if(!userResult){
        res.status(404).send("Ez a felhasználó még nem küldött üzeneteket vagy nem létezik.");
        return;
    };

    const results = datas.filter(m => m.sender === userName);
    if(results.length > 0){
        res.status(200).send(results);
        return;
    };

    res.status(400).send("Nincsenek elküldött üzenetek.");
};


export function getUserSentMessageById(req: Request, res: Response){
    const userName: string = req.params.userName;
    const messageId: number = parseInt(req.params.messageId);

    idIsNan(messageId, res);

    const userResult = datas.some(u => u.sender === userName);
    if(!userResult){
        res.status(404).send("Ez a felhasználó még nem küldött üzeneteket vagy nem létezik.");
        return;
    };

    const results = datas.filter(m => m.sender === userName && m.messageId === messageId);
    if(results.length > 0){
        res.status(200).send(results);
        return;
    };

    res.status(400).send("Nem létezik ilyen azonosítójú elem.");
};
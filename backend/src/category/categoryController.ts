import { Request, Response } from "express";
import datas from "./data";

export function getCategories(_req: Request, res: Response){
    res.status(200).send(datas);
}
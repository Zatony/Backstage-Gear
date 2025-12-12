import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../config/config";

export async function getCategories(_req: Request, res: Response){
    const connection = await mysql.createConnection(config.database);

    try{
        const [results] = await connection.query(
            'SELECT * FROM categories'
        ) as Array<any>;

        if(results.length > 0){
            res.status(200).send(results);
            return;
        };

        res.status(404).send("Nincsenek lekérendő kategóriák.");
    }
    catch(err){
        console.log(err);
    }
}
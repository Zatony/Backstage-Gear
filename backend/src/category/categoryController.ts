import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../config/config";
import { ICategory } from "./category";

export async function getCategories(_req: Request, res: Response){
    const connection = await mysql.createConnection(config.database);

    try{
        const [results] = await connection.query(
            'SELECT * FROM categories'
        ) as Array<any>;

        if (results.length > 0) {

            const BASE_URL = "http://localhost:3000"; 
            // később mehet .env-be
      
            const categories = results.map((row: ICategory) => ({
              ...row,
              picture: `${BASE_URL}/categories-pictures/${row.picture}`,
            }));
      
            res.status(200).send(categories);
            return;
          }

        res.status(404).send("Nincsenek lekérendő kategóriák.");
    }
    catch(err){
        console.log(err);
    }
}
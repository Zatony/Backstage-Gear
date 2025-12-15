import { Request, Response } from "express";
import datas from "./data";
import mysql from "mysql2/promise";
import config from "../config/config";


function idIsNan(id: number, res: Response){
    if(isNaN(id)){
        res.status(400).send("Nem megfelelő formátumú azonosító.");
        return;
    };
};


export async function getAds(_req: Request, res: Response){
    const connection = await mysql.createConnection(config.database);

    try{
        const [results] = await connection.query(
            `SELECT 
                advertisements.id,
                items.name,
                advertisements.description,
                used_items.price,
            GROUP_CONCAT(files.file_name) AS files
            FROM advertisements
            INNER JOIN used_items ON advertisements.used_item_id = used_items.id
            INNER JOIN items ON used_items.item_id = items.id
            INNER JOIN ad_files ON advertisements.id = ad_files.ad_id
            INNER JOIN files ON ad_files.file_id = files.id
            GROUP BY advertisements.id;`
        ) as Array<any>;

        if(results.length > 0){
            res.status(200).send(results);
            return;
        };

        res.status(404).send("Nincsenek lekérendő hirdetések.");
    }
    catch(err){
        console.log(err);
    }

    //res.status(200).send(datas);
};


export async function getLatestAds(_req: Request, res: Response){
    const connection = await mysql.createConnection(config.database);

    try{
        const [results] = await connection.query(
            `SELECT advertisements.id, items.name, advertisements.description, used_items.price, GROUP_CONCAT(files.file_name) AS files
            FROM advertisements
            INNER JOIN used_items ON advertisements.used_item_id = used_items.id
            INNER JOIN items ON used_items.item_id = items.id
            INNER JOIN ad_files ON advertisements.id = ad_files.ad_id
            INNER JOIN files ON ad_files.file_id = files.id
            GROUP BY advertisements.id
            ORDER BY advertisements.date_of_ad DESC
            LIMIT 3;`
        ) as Array<any>;

        if(results.length > 0){
            res.status(200).send(results);
            return;
        };

        res.status(404).send("Nincsenek lekérendő hirdetések.");
    }
    catch(err){
        console.log(err);
    }

    //res.status(200).send(datas);
};


export async function getAdDatasById(req: Request, res: Response){
    const id: number = parseInt(req.params.adId);
    idIsNan(id, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            `SELECT 
                advertisements.id, 
                items.name, 
                categories.name, 
                items.brand, 
                used_items.item_condition, 
                used_items.price, 
                GROUP_CONCAT(files.file_name) AS files,
                users.email, 
                advertisements.description
            FROM advertisements
            INNER JOIN used_items ON advertisements.used_item_id = used_items.id
            INNER JOIN items ON used_items.item_id = items.id
            INNER JOIN ad_files ON advertisements.id = ad_files.ad_id
            INNER JOIN files ON ad_files.file_id = files.id
            INNER JOIN categories ON items.category_id = categories.id
            INNER JOIN users ON advertisements.user_id = users.id
            WHERE advertisements.id = ?
            GROUP BY advertisements.id;`,
            [id]
        ) as Array<any>;

        if(result.length > 0){
            res.status(200).send(result);
            return;
        };

        res.status(404).send("Nincs ilyen azonosítójú elem.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getUserAds(req: Request, res: Response){
    const userId: string = req.params.userId;

    /*
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
    */

    const connection = await mysql.createConnection(config.database);

    try{
        const [results] = await connection.query(
            `SELECT 
                advertisements.id,
                items.name, 
                advertisements.description, 
                used_items.price, 
                GROUP_CONCAT(files.file_name) AS files
            FROM advertisements
            INNER JOIN used_items ON advertisements.used_item_id = used_items.id
            INNER JOIN items ON used_items.item_id = items.id
            INNER JOIN ad_files ON advertisements.id = ad_files.ad_id
            INNER JOIN files ON ad_files.file_id = files.id
            INNER JOIN users ON advertisements.user_id = users.id
            WHERE users.id = ?
            GROUP BY advertisements.id;`,
            [userId]
        ) as Array<any>;

        if(results){

        };
    }
    catch(err){
        console.log(err);
    }

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
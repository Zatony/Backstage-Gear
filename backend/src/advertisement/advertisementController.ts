import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../config/config";
import { idIsNan } from "../validators/id.validator";


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
    const userId: number = parseInt(req.params.userId);
    idIsNan(userId, res);

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

        if(results.length > 0){
            res.status(200).send(results);
            return;
        };

        res.status(404).send("Nincsenek még hirdetések.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getUserAdById(req: Request, res: Response){
    const userId: number = parseInt(req.params.userId);
    const adId: number = parseInt(req.params.adId);

    idIsNan(adId, res);
    idIsNan(userId, res);

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
            WHERE users.id = ? AND advertisements.id = ?
            GROUP BY advertisements.id;`,
            [userId, adId]
        ) as Array<any>;

        if(result.length > 0){
            res.status(200).send(result);
            return;
        };

        res.status(400).send("Nem létezik ilyen hirdetés.");
    }
    catch(err){
        console.log(err);
    }
};
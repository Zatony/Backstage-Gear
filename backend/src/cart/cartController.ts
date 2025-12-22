import { Request, Response } from "express";
import config from "../config/config";
import mysql from "mysql2/promise";
import { idIsNan } from "../validators/id.validator";


async function isUserExisted(id: number, res: Response, connection: any){
    const [result] = await connection.query(
        'SELECT id FROM users WHERE id = ?',
        [id]
    ) as Array<any>;

    if(result.length === 0){
        res.status(404).send("Ez a felhasználó nem létezik.");
        return;
    };
};


export async function getAdsFromUserCart(req: Request, res: Response) {
    const userId: number = parseInt(req.params.userId);
    idIsNan(userId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        isUserExisted(userId, res, connection);
        

        const [results] = await connection.query(
            `SELECT
                advertisements.id,
                items.name,
                advertisements.description,
                used_items.price,
                GROUP_CONCAT(files.file_name) AS files
            FROM carts
            INNER JOIN users ON carts.user_id = users.id
            INNER JOIN advertisements ON carts.ad_id = advertisements.id
            INNER JOIN used_items ON advertisements.used_item_id = used_items.id
            INNER JOIN items ON used_items.item_id = items.id
            INNER JOIN ad_files ON advertisements.id = ad_files.ad_id
            INNER JOIN files ON ad_files.file_id = files.id
            WHERE users.id = ?
            GROUP BY advertisements.id;`,
            [userId]
        ) as Array<any>;

        if(results.length > 0){
            res.status(200).send(results);
            return;
        };

        res.status(404).send("Nincsenek még kosárba helyezett hirdetések.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getAdByIdFromUserCart(req: Request, res: Response) {
    const userId: number = parseInt(req.params.userId);
    const adId: number = parseInt(req.params.adId);

    idIsNan(userId, res);
    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        isUserExisted(userId, res, connection);


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
            FROM carts
            INNER JOIN users ON carts.user_id = users.id
            INNER JOIN advertisements ON carts.ad_id = advertisements.id
            INNER JOIN used_items ON advertisements.used_item_id = used_items.id
            INNER JOIN items ON used_items.item_id = items.id
            INNER JOIN ad_files ON advertisements.id = ad_files.ad_id
            INNER JOIN files ON ad_files.file_id = files.id
            INNER JOIN categories ON items.category_id = categories.id
            WHERE users.id = ? AND advertisements.id = ?
            GROUP BY advertisements.id;`,
            [userId, adId]
        ) as Array<any>;

        if(result.length > 0){
            res.status(200).send(result);
            return;
        };

        res.status(404).send("Nincs ilyen azonosítójú hirdetés.");
    }
    catch(err){
        console.log(err);
    }
};
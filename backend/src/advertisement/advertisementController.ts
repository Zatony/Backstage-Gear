import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../config/config";
import { bodyIsUndefined, idIsNan } from "../validators/id.validator";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";


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
            const formattedResults = results.map((ad: any) => ({
                ...ad,
                files: ad.files
                    ? ad.files.split(",").map((file: string) => BASE_URL + "/ad-pictures/" + file)
                    : []
            }));

            res.status(200).send(formattedResults);
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
            `SELECT 
                advertisements.id,
                items.name,
                advertisements.description,
                used_items.price,
                GROUP_CONCAT(files.file_name) AS files
            FROM advertisements
            INNER JOIN used_items ON advertisements.used_item_id = used_items.id
            INNER JOIN items ON used_items.item_id = items.id
            LEFT JOIN ad_files ON advertisements.id = ad_files.ad_id
            LEFT JOIN files ON ad_files.file_id = files.id
            GROUP BY 
                advertisements.id,
                items.name,
                advertisements.description,
                used_items.price
            ORDER BY advertisements.date_of_ad DESC
            LIMIT 10;`
        ) as Array<any>;

        if(results.length > 0){
            const formattedResults = results.map((ad: any) => ({
                ...ad,
                files: ad.files
                    ? ad.files.split(",").map((file: string) => BASE_URL + "/ad-pictures/" + file)
                    : []
            }));

            res.status(200).send(formattedResults);
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
                items.name AS item_name, 
                categories.name AS category_name, 
                brands.brand_name, 
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
            INNER JOIN brands ON items.brand_id = brands.id
            WHERE advertisements.id = ?
            GROUP BY advertisements.id;`,
            [id]
        ) as Array<any>;

        if(result.length > 0){
            const formattedResults = result.map((ad: any) => ({
                ...ad,
                files: ad.files
                    ? ad.files.split(",").map((file: string) => BASE_URL + "/ad-pictures/" + file)
                    : []
            }));

            res.status(200).send(formattedResults);
            return;
        };

        res.status(404).send("Nincs ilyen azonosítójú elem.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getUserAds(req: any, res: any){
    const userId: number = parseInt(req.user.id);

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
            const formattedResults = results.map((ad: any) => ({
                ...ad,
                files: ad.files
                    ? ad.files.split(",").map((file: string) => BASE_URL + "/ad-pictures/" + file)
                    : []
            }));

            res.status(200).send(formattedResults);
            return;
        };

        res.status(404).send("Nincsenek lekérendő hirdetések.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getUserAdById(req: any, res: any){
    const userId: number = parseInt(req.user.id);
    const adId: number = parseInt(req.params.adId);

    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);
    
    try{
        const [result] = await connection.query(
            `SELECT 
                advertisements.id, 
                items.name AS item_name, 
                categories.name AS category_name, 
                brands.brand_name, 
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
            INNER JOIN brands ON items.brand_id = brands.id
            WHERE users.id = ? AND advertisements.id = ?
            GROUP BY advertisements.id;`,
            [userId, adId]
        ) as Array<any>;

        if(result.length > 0){
            const formattedResults = result.map((ad: any) => ({
                ...ad,
                files: ad.files
                    ? ad.files.split(",").map((file: string) => BASE_URL + "/ad-pictures/" + file)
                    : []
            }));

            res.status(200).send(formattedResults);
            return;
        };

        res.status(404).send("Nem létezik ilyen aznosítójú elem.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getReportedAds(_req: any, res: any) {
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
            WHERE advertisements.is_reported = 1
            GROUP BY advertisements.id;`
        ) as Array<any>;

        if(results.length > 0){
            const formattedResults = results.map((ad: any) => ({
                ...ad,
                files: ad.files
                    ? ad.files.split(",").map((file: string) => BASE_URL + "/ad-pictures/" + file)
                    : []
            }));

            res.status(200).send(formattedResults);
            return;
        };

        res.status(404).send("Nincsenek lekérendő hirdetések.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getReportedAdById(req: any, res: any) {
    const adId: number = parseInt(req.params.adId);

    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            `SELECT 
                advertisements.id, 
                items.name AS item_name, 
                categories.name AS category_name, 
                brands.brand_name, 
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
            INNER JOIN brands ON items.brand_id = brands.id
            WHERE advertisements.is_reported = 1 AND advertisements.id = ?
            GROUP BY advertisements.id;`,
            [adId]
        ) as Array<any>;

        if(result.length > 0){
            const formattedResults = result.map((ad: any) => ({
                ...ad,
                files: ad.files
                    ? ad.files.split(",").map((file: string) => BASE_URL + "/ad-pictures/" + file)
                    : []
            }));

            res.status(200).send(formattedResults);
            return;
        };

        res.status(404).send("Nincs ilyen azonosítójú jelentett hirdetés.");
    }
    catch(err){
        console.log(err);
    }
};


export async function reportAdById(req: any, res: any) {
    const adId: number = parseInt(req.params.adId);
    const userId: number = parseInt(req.user.id);

    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [adResult] = await connection.query(
            "SELECT user_id FROM advertisements WHERE id = ?",
            [adId]
        ) as Array<any>;

        if(adResult.length === 0){
            res.status(404).send("Nincs ilyen azonosítójú hirdetés.");
            return;
        };

        if(adResult[0].user_id === userId){
            res.status(403).send("A saját hirdetésedet nem tudod jelenteni.");
            return;
        };


        const [result] = await connection.query(
            "UPDATE advertisements SET is_reported = 1 WHERE id = ?",
            [adId]
        ) as Array<any>;

        if(result.affectedRows > 0){
            res.status(200).send("Sikeres jelentés.");
            return;
        };
    }
    catch(err){
        console.log(err);
    }
};


export async function deleteAdFromReportedAdsById(req: any, res: any) {
    const adId: number = parseInt(req.params.adId);

    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            "UPDATE advertisements SET is_reported = 0 WHERE id = ?",
            [adId]
        ) as Array<any>;

        if(result.affectedRows > 0){
            res.status(200).send("Sikeresen törölted a hirdetés jelentését.");
            return;
        };

        res.status(404).send("Nincs ilyen azonosítójú jelentett hirdetés.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getBrands(__req: any, res: any) {
    const connection = await mysql.createConnection(config.database);

    try{
        const [results] = await connection.query(
            `SELECT * FROM brands`
        ) as Array<any>;

        if(results.length > 0){
            console.log("Fetched brands: ", results);
            res.status(200).send(results);
            return;
        };

        res.status(404).send("Nincsenek lekérendő márkák.");
    }
    catch(err){
        console.log(err);
    }
};


export async function postNewAdvertisement(req: any, res: any) {
    const userId = parseInt(req.user.id);

    bodyIsUndefined(req, res);

    const {
        categoryId,
        brandId,
        itemName,
        price,
        condition,
        description
    } = req.body;

    if (
        !categoryId || !brandId || !itemName ||
        !price || !condition || !description
    ) {
        res.status(400).send("Hibásan vagy hiányosan megadott adatok.");
        return;
    };

    const connection = await mysql.createConnection(config.database);

    try {
        await connection.beginTransaction();

        const [itemResult]: any = await connection.query(
            `INSERT INTO items (category_id, brand_id, name)
             VALUES (?, ?, ?)`,
            [categoryId, brandId, itemName]
        );

        const itemId = itemResult.insertId;

        const [usedItemResult]: any = await connection.query(
            `INSERT INTO used_items (item_id, price, item_condition)
             VALUES (?, ?, ?)`,
            [itemId, price, condition]
        );

        const usedItemId = usedItemResult.insertId;

        const [adResult]: any = await connection.query(
            `INSERT INTO advertisements (user_id, used_item_id, description, date_of_ad)
             VALUES (?, ?, ?, CURDATE())`,
            [userId, usedItemId, description]
        );

        const adId = adResult.insertId;

        await connection.query(
            `INSERT INTO ad_files (ad_id, file_id)
             VALUES (?, ?)`,
            [adId, "default-ad"]
        );

        await connection.commit();

        res.status(201).json({
            message: "Hirdetés sikeresen létrehozva.",
            adId
        });

    } catch (err) {
        await connection.rollback();
        console.error(err);
    }
};
import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../config/config";
import { bodyIsUndefined, idIsNan } from "../validators/id.validator";
import db from "../database/db";
import { RowDataPacket } from "mysql2";
import fs from "fs";


export async function getAds(_req: Request, res: Response){
    const connection = await mysql.createConnection(config.database);

    try{
        const [results] = await connection.query(
            `SELECT 
                advertisements.id,
                items.name,
                advertisements.description,
                used_items.price,
                GROUP_CONCAT(files.id) AS files
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
                    ? ad.files.split(",").map((file: string) => config.baseUrl + "/ad-pictures/" + (file === "default-ad-picture" ? file + ".png" : file))
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
    finally{
        await connection.end();
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
                GROUP_CONCAT(files.id) AS files
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
                    ? ad.files.split(",").map((file: string) => config.baseUrl + "/ad-pictures/" + (file === "default-ad-picture" ? file + ".png" : file))
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
    finally{
        await connection.end();
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
                advertisements.user_id,
                items.name AS item_name, 
                categories.name AS category_name, 
                brands.brand_name, 
                used_items.item_condition, 
                used_items.price, 
                GROUP_CONCAT(files.id) AS files,
                users.email, 
                advertisements.description,
                DATE_FORMAT(advertisements.date_of_ad, '%Y-%m-%d %H:%i:%s') as date_of_ad
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
                    ? ad.files.split(",").map((file: string) => config.baseUrl + "/ad-pictures/" + (file === "default-ad-picture" ? file + ".png" : file))
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
    finally{
        await connection.end();
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
                GROUP_CONCAT(files.id) AS files
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
                    ? ad.files.split(",").map((file: string) => config.baseUrl + "/ad-pictures/" + (file === "default-ad-picture" ? file + ".png" : file))
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
    finally{
        await connection.end();
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
                advertisements.user_id,
                items.name AS item_name, 
                categories.name AS category_name, 
                brands.brand_name, 
                used_items.item_condition, 
                used_items.price, 
                GROUP_CONCAT(files.id) AS files,
                users.email, 
                advertisements.description,
                DATE_FORMAT(advertisements.date_of_ad, '%Y-%m-%d %H:%i:%s') as date_of_ad
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
                    ? ad.files.split(",").map((file: string) => config.baseUrl + "/ad-pictures/" + file)
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
    finally{
        await connection.end();
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
    finally{
        await connection.end();
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
    finally{
        await connection.end();
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
    const savedFiles: string[] = [];

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
            `INSERT INTO advertisements (user_id, used_item_id, description)
             VALUES (?, ?, ?)`,
            [userId, usedItemId, description]
        );

        const adId = adResult.insertId;

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const adPicturesDir = config.baseDir + config.uploadDir + "ad-pictures/";
            try { fs.mkdirSync(adPicturesDir, { recursive: true }); } catch (e) { /* ignore */ }

            for (const f of req.files) {
                const fileId = f.filename;
                const fileName = f.originalname;
                const fileSize = f.size;

                try {
                    fs.renameSync(
                        config.baseDir + config.uploadDir + fileId,
                        adPicturesDir + fileId
                    );
                } catch (e) {
                    console.error('Fájl áthelyezése sikertelen:', e);
                    throw e;
                }

                await connection.query(
                    'INSERT INTO files(id, file_name, file_size) VALUES(?, ?, ?)',
                    [fileId, fileName, fileSize]
                );

                await connection.query(
                    'INSERT INTO ad_files VALUES(?, ?)',
                    [adId, fileId]
                );

                savedFiles.push(fileId);
            }
        } else {
            await connection.query(
                `INSERT INTO ad_files (ad_id, file_id)
                 VALUES (?, ?)`,
                [adId, "default-ad-picture"]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: "Hirdetés sikeresen létrehozva.",
            adId
        });

    } catch (err) {
        await connection.rollback();
        try {
            for (const f of savedFiles) {
                const adPicturesPath = config.baseDir + config.uploadDir + "ad-pictures/" + f;
                const rootPath = config.baseDir + config.uploadDir + f;
                try {
                    fs.unlinkSync(adPicturesPath);
                } catch (e) {
                    try { fs.unlinkSync(rootPath); } catch (_) { /* ignore */ }
                }
            }
        } catch (e) {
            console.error('Fájl törlése sikertelen:', e);
        }

        console.error(err);
        res.status(500).send({ error: 'Hiba történt a hirdetés létrehozása során.' });
    }
    finally{
        await connection.end();
    }
};


export const getFilteredAdvertisements = async (req: Request, res: Response) => {
    const connection = await db.getConnection();
    try {
        const {
            categoryIds,
            brandId,
            conditions,
            minPrice,
            maxPrice,
            q,
            page = "1",
            limit = "20",
        } = req.query;

        const sqlConditions: string[] = [];
        const params: any[] = [];


        if (categoryIds) {
            const categoryArray = String(categoryIds).split(",").map(c => c.trim());
            const categoryPlaceholders = categoryArray.map(() => "i.category_id = ?").join(" OR ");
            sqlConditions.push(`(${categoryPlaceholders})`);
            categoryArray.forEach(c => params.push(Number(c)));
        };

        if (brandId) {
            sqlConditions.push("i.brand_id = ?");
            params.push(Number(brandId));
        };

        if (conditions) {
            const conditionArray = String(conditions).split(",").map(c => c.trim());
            const conditionPlaceholders = conditionArray.map(() => "ui.item_condition = ?").join(" OR ");
            sqlConditions.push(`(${conditionPlaceholders})`);
            conditionArray.forEach(c => params.push(c));
        };

        if (minPrice) {
            sqlConditions.push("ui.price >= ?");
            params.push(Number(minPrice));
        };

        if (maxPrice) {
            sqlConditions.push("ui.price <= ?");
            params.push(Number(maxPrice));
        };

        if (q) {
            const like = `%${String(q)}%`;
            sqlConditions.push(`(i.name LIKE ? OR a.description LIKE ?)`);
            params.push(like, like);
        };

        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);
        const offset = (pageNumber - 1) * limitNumber;

        const whereClause =
        sqlConditions.length > 0 ? `WHERE ${sqlConditions.join(" AND ")}` : "";

        const sql = `
            SELECT
                a.id AS advertisementId,
                a.description,
                ui.price,
                ui.item_condition,
                i.name AS item_name,
                c.name AS category,
                b.brand_name AS brand,
                GROUP_CONCAT(f.id) AS files
            FROM advertisements a
            JOIN used_items ui ON a.used_item_id = ui.id
            JOIN items i ON ui.item_id = i.id
            JOIN categories c ON i.category_id = c.id
            JOIN brands b ON i.brand_id = b.id
            LEFT JOIN ad_files af ON a.id = af.ad_id
            LEFT JOIN files f ON af.file_id = f.id
            ${whereClause}
            GROUP BY a.id
            ORDER BY a.date_of_ad DESC
            LIMIT ${limitNumber} OFFSET ${offset}
        `;

        const [rows] = await connection.query<RowDataPacket[]>(sql, params);

        const formattedResults = rows.map((ad: any) => ({
            ...ad,
            files: ad.files
                ? ad.files.split(",").map(
                      (file: string) =>
                          config.baseUrl + "/ad-pictures/" + (file === "default-ad-picture" ? file + ".png" : file)
                  )
                : [],
        }));

        res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            count: rows.length,
            data: formattedResults,
        });
    } catch (error) {
        console.error(error);
    } finally {
        connection.release();
    }
};


export async function deleteOwnAdById(req: any, res: any) {
    const adId = parseInt(req.params.adId);
    const userId = parseInt(req.user.id);

    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);

    try {
        await connection.beginTransaction();

        const [[ad]]: any = await connection.query(
            `SELECT id, used_item_id FROM advertisements WHERE id = ? AND user_id = ?`,
            [adId, userId]
        );

        if (!ad) {
            await connection.rollback();
            return res.status(403).send("Nincs jogosultság vagy nem létező hirdetés.");
        }

        const usedItemId = ad.used_item_id;

        const [[row]]: any = await connection.query(
            `SELECT item_id FROM used_items WHERE id = ?`,
            [usedItemId]
        );

        const itemId = row?.item_id;

        await connection.query(
            `DELETE FROM carts WHERE ad_id = ?`,
            [adId]
        );

        await connection.query(
            `DELETE FROM advertisements WHERE id = ?`,
            [adId]
        );

        const [[usedItemCount]]: any = await connection.query(
            `SELECT COUNT(*) as count FROM advertisements WHERE used_item_id = ?`,
            [usedItemId]
        );
        if (usedItemCount.count === 0) {
            await connection.query(
                `DELETE FROM used_items WHERE id = ?`,
                [usedItemId]
            );

            if (itemId) {
                const [[itemCount]]: any = await connection.query(
                    `SELECT COUNT(*) as count FROM used_items WHERE item_id = ?`,
                    [itemId]
                );
                if (itemCount.count === 0) {
                    await connection.query(
                        `DELETE FROM items WHERE id = ?`,
                        [itemId]
                    );
                }
            }
        }

        await connection.commit();
        res.status(204).send();

    } catch (err) {
        await connection.rollback();
        console.error(err);
    } finally {
        await connection.end();
    }
};


export async function patchAdById(req: any, res: any) {
    const adId = parseInt(req.params.adId);
    const userId = parseInt(req.user.id);

    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);
    const savedFiles: string[] = [];

    try {
        await connection.beginTransaction();

        const [[ad]]: any = await connection.query(
            `SELECT id, used_item_id, user_id FROM advertisements WHERE id = ?`,
            [adId]
        );

        if (!ad) {
            await connection.rollback();
            return res.status(404).send("Nincs ilyen azonosítójú hirdetés.");
        }

        if (parseInt(ad.user_id) !== userId) {
            await connection.rollback();
            return res.status(403).send("Nincs jogosultságod a hirdetés módosításához.");
        }

        const usedItemId = ad.used_item_id;

        const [[usedItemRow]]: any = await connection.query(
            `SELECT item_id FROM used_items WHERE id = ?`,
            [usedItemId]
        );

        const itemId = usedItemRow?.item_id;

        const {
            categoryId,
            brandId,
            itemName,
            price,
            condition,
            description
        } = req.body;

        if (itemId) {
            await connection.query(
                `UPDATE items SET name = COALESCE(?, name), category_id = COALESCE(?, category_id), brand_id = COALESCE(?, brand_id) WHERE id = ?`,
                [itemName ?? null, categoryId ?? null, brandId ?? null, itemId]
            );
        }

        await connection.query(
            `UPDATE used_items SET price = COALESCE(?, price), item_condition = COALESCE(?, item_condition) WHERE id = ?`,
            [price ?? null, condition ?? null, usedItemId]
        );

        await connection.query(
            `UPDATE advertisements SET description = COALESCE(?, description) WHERE id = ?`,
            [description ?? null, adId]
        );

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            await connection.query(
                'DELETE FROM ad_files WHERE ad_id = ?',
                [adId]
            );

            const adPicturesDir = config.baseDir + config.uploadDir + "ad-pictures/";
            try { fs.mkdirSync(adPicturesDir, { recursive: true }); } catch (e) { /* ignore */ }

            for (const f of req.files) {
                const fileId = f.filename;
                const fileName = f.originalname;
                const fileSize = f.size;

                try {
                    fs.renameSync(
                        config.baseDir + config.uploadDir + fileId,
                        adPicturesDir + fileId
                    );
                } catch (e) {
                    console.error('Fájl áthelyezése sikertelen:', e);
                    throw e;
                }

                await connection.query(
                    'INSERT INTO files(id, file_name, file_size) VALUES(?, ?, ?)',
                    [fileId, fileName, fileSize]
                );

                await connection.query(
                    'INSERT INTO ad_files VALUES(?, ?)',
                    [adId, fileId]
                );

                savedFiles.push(fileId);
            }
        }

        await connection.commit();

        res.status(200).send({ message: 'Hirdetés frissítve.' });

    } catch (err) {
        await connection.rollback();

        try {
            for (const f of savedFiles) {
                const adPicturesPath = config.baseDir + config.uploadDir + "ad-pictures/" + f;
                const rootPath = config.baseDir + config.uploadDir + f;
                try {
                    fs.unlinkSync(adPicturesPath);
                } catch (e) {
                    try { fs.unlinkSync(rootPath); } catch (_) { /* ignore */ }
                }
            }
        } catch (e) {
            console.error('Fájl törlése sikertelen:', e);
        }

        console.error(err);
        res.status(500).send({ error: 'Hiba történt a hirdetés frissítése során.' });
    } finally {
        await connection.end();
    }
};


////// ADMIN

export async function getReportedAds(_req: any, res: any) {
    const connection = await mysql.createConnection(config.database);

    try{
        const [results] = await connection.query(
            `SELECT
                advertisements.id,
                items.name, 
                advertisements.description, 
                used_items.price, 
                GROUP_CONCAT(files.id) AS files
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
                    ? ad.files.split(",").map((file: string) => config.baseUrl + "/ad-pictures/" + (file === "default-ad-picture" ? file + ".png" : file))
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
    finally{
        await connection.end();
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
                advertisements.user_id,
                items.name AS item_name, 
                categories.name AS category_name, 
                brands.brand_name, 
                used_items.item_condition, 
                used_items.price, 
                GROUP_CONCAT(files.id) AS files,
                users.email, 
                advertisements.description,
                DATE_FORMAT(advertisements.date_of_ad, '%Y-%m-%d %H:%i:%s') as date_of_ad
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
                    ? ad.files.split(",").map((file: string) => config.baseUrl + "/ad-pictures/" + (file === "default-ad-picture" ? file + ".png" : file))
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
    finally{
        await connection.end();
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
    finally{
        await connection.end();
    }
};


export async function deleteUsersAdById(req: any, res: any) {
    const adId: number = parseInt(req.params.adId);

    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);

    try {
        await connection.beginTransaction();

        const [reportedAdCheck] = await connection.query(
            'SELECT id FROM advertisements WHERE is_reported = 1 AND id = ?',
            [adId]
        ) as Array<any>;

        if(reportedAdCheck.length < 1){
            res.status(404).send("Nincs ilyen azonosítójú jelentett hirdetés.");
            return;
        };

        const [[ad]]: any = await connection.query(
            `SELECT id, used_item_id FROM advertisements WHERE id = ?`,
            [adId]
        );

        if (!ad) {
            await connection.rollback();
            return res.status(403).send("Nincs jogosultság vagy nem létező hirdetés.");
        };

        const usedItemId = ad.used_item_id;

        const [[row]]: any = await connection.query(
            `SELECT item_id FROM used_items WHERE id = ?`,
            [usedItemId]
        );

        const itemId = row?.item_id;

        await connection.query(
            `DELETE FROM carts WHERE ad_id = ?`,
            [adId]
        );

        await connection.query(
            `DELETE FROM advertisements WHERE id = ?`,
            [adId]
        );

        // Now check how many advertisements reference this used_item AFTER deleting the advertisement
        const [[usedItemCount]]: any = await connection.query(
            `SELECT COUNT(*) as count FROM advertisements WHERE used_item_id = ?`,
            [usedItemId]
        );
        if (usedItemCount.count === 0) {
            await connection.query(
                `DELETE FROM used_items WHERE id = ?`,
                [usedItemId]
            );

            // Only delete item if no other used_items reference it
            if (itemId) {
                const [[itemCount]]: any = await connection.query(
                    `SELECT COUNT(*) as count FROM used_items WHERE item_id = ?`,
                    [itemId]
                );
                if (itemCount.count === 0) {
                    await connection.query(
                        `DELETE FROM items WHERE id = ?`,
                        [itemId]
                    );
                }
            }
        }

        await connection.commit();
        res.status(204).send();

    } catch (err) {
        await connection.rollback();
        console.error(err);
    } finally {
        await connection.end();
    }
};
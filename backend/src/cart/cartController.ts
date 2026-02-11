import config from "../config/config";
import mysql from "mysql2/promise";
import { idIsNan } from "../validators/id.validator";


export async function getAdsFromUserCart(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    idIsNan(userId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [results] = await connection.query(
            `SELECT
                advertisements.id,
                items.name,
                advertisements.description,
                used_items.price,
                GROUP_CONCAT(files.id) AS files
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
            const formattedResults = results.map((ad: any) => ({
                ...ad,
                files: ad.files
                    ? ad.files.split(",").map((file: string) => config.baseUrl + "/ad-pictures/" + (file === "default-ad-picture" ? file + ".png" : file))
                    : []
            }));

            res.status(200).send(formattedResults);
            return;
        };

        res.status(404).send("Nincsenek még kosárba helyezett hirdetések.");
    }
    catch(err){
        console.log(err);
    }
    finally{
        await connection.end();
    }
};


export async function getAdByIdFromUserCart(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    const adId: number = parseInt(req.params.adId);

    idIsNan(userId, res);
    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            `SELECT 
                advertisements.id, 
                items.name, 
                categories.name, 
                brands.brand_name, 
                used_items.item_condition, 
                used_items.price, 
                GROUP_CONCAT(files.id) AS files,
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
            INNER JOIN brands ON items.brand_id = brands.id
            WHERE users.id = ? AND advertisements.id = ?
            GROUP BY advertisements.id;`,
            [userId, adId]
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

        res.status(404).send("Nincs ilyen azonosítójú hirdetés.");
    }
    catch(err){
        console.log(err);
    }
    finally{
        await connection.end();
    }
};


export async function putNewAdIntoCartByAdId(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    const adId: number = parseInt(req.params.adId);

    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [isAdExistedCheck] = await connection.query(
            'SELECT id FROM advertisements WHERE id = ?',
            [adId]
        ) as Array<any>;

        if(isAdExistedCheck.length === 0){
            res.status(404).send("Nem létezik ilyen azonosítójú hirdetés.");
            return;
        };


        const [isAdAlreadyInCartCheck] = await connection.query(
            'SELECT id FROM carts WHERE user_id = ? AND ad_id = ?',
            [userId, adId]
        ) as Array<any>;

        if(isAdAlreadyInCartCheck.length > 0){
            res.status(400).send("Ezt a hirdetést már beraktad a kosaradba.");
            return;
        };


        const [selfAdCheck] = await connection.query(
            'SELECT user_id AS uid FROM advertisements WHERE id = ?',
            [adId]
        ) as Array<any>;

        if(selfAdCheck[0].uid === userId){
            res.status(400).send("A saját hirdetésedet nem tudod a kosaradba tenni.");
            return;
        };


        const [result] = await connection.query(
            'INSERT INTO carts(user_id, ad_id) VALUES (?, ?)',
            [userId, adId]
        ) as Array<any>;

        if(result.affectedRows > 0){
            res.status(201).send("Sikeres a hirdetés kosárba helyezése.");
            return;
        };

        res.status(404).send("Nem sikerült a hirdetés kosárba helyezése.");
    }
    catch(err){
        console.log(err);
    }
    finally{
        await connection.end();
    }
};


export async function deleteAdFromCartByAdId(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    const adId: number = parseInt(req.params.adId);

    idIsNan(adId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [adResult] = await connection.query(
            'SELECT id FROM advertisements WHERE id = ?',
            [adId]
        ) as Array<any>;

        if(adResult.length === 0){
            res.status(404).send("Nem létezik ilyen azonosítójú hirdetés.");
            return;
        };


        const [result] = await connection.query(
            'DELETE FROM carts WHERE user_id = ? AND ad_id = ?',
            [userId, adId]
        ) as Array<any>;

        if(result.affectedRows > 0){
            res.status(204).send();
            return;
        };

        res.status(404).send("Nem sikerült az adattörlés.");
    }
    catch(err){
        console.log(err);
    }
    finally{
        await connection.end();
    }
};
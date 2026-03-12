import mysql from "mysql2/promise";
import config from "../config/config";

function formatCartAds(rows: any[]): any[] {
    return rows.map((ad: any) => ({
        ...ad,
        files: ad.files
            ? ad.files.split(",").map((file: string) => config.baseUrl + "/ad-pictures/" + (file === "default-ad-picture" ? file + ".png" : file))
            : []
    }));
}

export async function getAdsFromUserCartService(userId: number): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (results.length === 0) {
            throw new Error("NO_CART_ADS");
        }

        return formatCartAds(results);
    }
    finally {
        await connection.end();
    }
}

export async function getAdByIdFromUserCartService(userId: number, adId: number): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (result.length === 0) {
            throw new Error("AD_NOT_FOUND");
        }

        return formatCartAds(result);
    }
    finally {
        await connection.end();
    }
}

export async function putNewAdIntoCartByAdIdService(userId: number, adId: number): Promise<void> {
    const connection = await mysql.createConnection(config.database);

    try {
        const [isAdExistedCheck] = await connection.query(
            "SELECT id FROM advertisements WHERE id = ?",
            [adId]
        ) as Array<any>;

        if (isAdExistedCheck.length === 0) {
            throw new Error("AD_NOT_FOUND");
        }

        const [isAdAlreadyInCartCheck] = await connection.query(
            "SELECT id FROM carts WHERE user_id = ? AND ad_id = ?",
            [userId, adId]
        ) as Array<any>;

        if (isAdAlreadyInCartCheck.length > 0) {
            throw new Error("AD_ALREADY_IN_CART");
        }

        const [selfAdCheck] = await connection.query(
            "SELECT user_id AS uid FROM advertisements WHERE id = ?",
            [adId]
        ) as Array<any>;

        if (selfAdCheck[0].uid === userId) {
            throw new Error("OWN_AD_FORBIDDEN");
        }

        const [result] = await connection.query(
            "INSERT INTO carts(user_id, ad_id) VALUES (?, ?)",
            [userId, adId]
        ) as Array<any>;

        if (result.affectedRows === 0) {
            throw new Error("ADD_TO_CART_FAILED");
        }
    }
    finally {
        await connection.end();
    }
}

export async function deleteAdFromCartByAdIdService(userId: number, adId: number): Promise<void> {
    const connection = await mysql.createConnection(config.database);

    try {
        const [adResult] = await connection.query(
            "SELECT id FROM advertisements WHERE id = ?",
            [adId]
        ) as Array<any>;

        if (adResult.length === 0) {
            throw new Error("AD_NOT_FOUND");
        }

        const [result] = await connection.query(
            "DELETE FROM carts WHERE user_id = ? AND ad_id = ?",
            [userId, adId]
        ) as Array<any>;

        if (result.affectedRows === 0) {
            throw new Error("DELETE_FROM_CART_FAILED");
        }
    }
    finally {
        await connection.end();
    }
}
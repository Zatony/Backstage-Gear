import mysql, { RowDataPacket } from "mysql2/promise";
import fs from "fs";
import path from "path";
import config from "../config/config";
import db from "../database/db";

export type UploadedAdvertisementFile = {
    filename: string;
    originalname: string;
    size: number;
};

export type AdvertisementMutationPayload = {
    categoryId?: number | string;
    brandId?: number | string;
    itemName?: string;
    price?: number | string;
    condition?: string;
    description?: string;
};

export type AdvertisementFilterQuery = {
    categoryIds?: string;
    brandId?: string;
    conditions?: string;
    minPrice?: string;
    maxPrice?: string;
    q?: string;
    page?: string;
    limit?: string;
};

type MysqlConnection = Awaited<ReturnType<typeof mysql.createConnection>>;

function formatAdsWithFiles(rows: any[], appendDefaultPictureExtension: boolean = true): any[] {
    return rows.map((ad: any) => ({
        ...ad,
        files: ad.files
            ? ad.files.split(",").map((file: string) => {
                if (appendDefaultPictureExtension && file === "default-ad-picture") {
                    return `${config.baseUrl}/ad-pictures/${file}.png`;
                }

                return `${config.baseUrl}/ad-pictures/${file}`;
            })
            : []
    }));
}

function ensureCreatePayload(payload: AdvertisementMutationPayload): void {
    const {
        categoryId,
        brandId,
        itemName,
        price,
        condition,
        description
    } = payload;

    if (
        !categoryId || !brandId || !itemName ||
        !price || !condition || !description
    ) {
        throw new Error("INVALID_AD_PAYLOAD");
    }
}

function ensureAdPicturesDir(): string {
    const adPicturesDir = path.join(config.uploadDir, "ad-pictures");
    fs.mkdirSync(adPicturesDir, { recursive: true });
    return adPicturesDir;
}

function cleanupSavedFiles(savedFiles: string[]): void {
    for (const fileId of savedFiles) {
        const adPicturesPath = path.join(config.uploadDir, "ad-pictures", fileId);
        const rootPath = path.join(config.uploadDir, fileId);

        try {
            fs.unlinkSync(adPicturesPath);
            continue;
        }
        catch {
        }

        try {
            fs.unlinkSync(rootPath);
        }
        catch {
        }
    }
}

async function saveUploadedFiles(
    connection: MysqlConnection,
    adId: number,
    files: UploadedAdvertisementFile[],
    savedFiles: string[]
): Promise<void> {
    const adPicturesDir = ensureAdPicturesDir();

    for (const file of files) {
        const fileId = file.filename;

        fs.renameSync(
            path.join(config.uploadDir, fileId),
            path.join(adPicturesDir, fileId)
        );

        await connection.query(
            "INSERT INTO files(id, file_name, file_size) VALUES(?, ?, ?)",
            [fileId, file.originalname, file.size]
        );

        await connection.query(
            "INSERT INTO ad_files VALUES(?, ?)",
            [adId, fileId]
        );

        savedFiles.push(fileId);
    }
}

export async function getAdsService(): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (results.length === 0) {
            throw new Error("NO_ADS");
        }

        return formatAdsWithFiles(results);
    }
    finally {
        await connection.end();
    }
}

export async function getLatestAdsService(): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (results.length === 0) {
            throw new Error("NO_ADS");
        }

        return formatAdsWithFiles(results);
    }
    finally {
        await connection.end();
    }
}

export async function getAdDatasByIdService(adId: number): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
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
            [adId]
        ) as Array<any>;

        if (result.length === 0) {
            throw new Error("AD_NOT_FOUND");
        }

        return formatAdsWithFiles(result);
    }
    finally {
        await connection.end();
    }
}

export async function getUserAdsService(userId: number): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (results.length === 0) {
            throw new Error("NO_ADS");
        }

        return formatAdsWithFiles(results);
    }
    finally {
        await connection.end();
    }
}

export async function getUserAdByIdService(userId: number, adId: number): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (result.length === 0) {
            throw new Error("USER_AD_NOT_FOUND");
        }

        return formatAdsWithFiles(result, false);
    }
    finally {
        await connection.end();
    }
}

export async function reportAdByIdService(adId: number, userId: number): Promise<void> {
    const connection = await mysql.createConnection(config.database);

    try {
        const [adResult] = await connection.query(
            "SELECT user_id FROM advertisements WHERE id = ?",
            [adId]
        ) as Array<any>;

        if (adResult.length === 0) {
            throw new Error("AD_NOT_FOUND");
        }

        if (adResult[0].user_id === userId) {
            throw new Error("OWN_AD_FORBIDDEN");
        }

        const [result] = await connection.query(
            "UPDATE advertisements SET is_reported = 1 WHERE id = ?",
            [adId]
        ) as Array<any>;

        if (result.affectedRows === 0) {
            throw new Error("REPORT_FAILED");
        }
    }
    finally {
        await connection.end();
    }
}

export async function getBrandsService(): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
        const [results] = await connection.query(
            "SELECT * FROM brands"
        ) as Array<any>;

        if (results.length === 0) {
            throw new Error("NO_BRANDS");
        }

        return results;
    }
    finally {
        await connection.end();
    }
}

export async function postNewAdvertisementService(
    userId: number,
    payload: AdvertisementMutationPayload,
    files: UploadedAdvertisementFile[] = []
): Promise<number> {
    ensureCreatePayload(payload);

    const connection = await mysql.createConnection(config.database);
    const savedFiles: string[] = [];

    try {
        await connection.beginTransaction();

        const [itemResult]: any = await connection.query(
            `INSERT INTO items (category_id, brand_id, name)
             VALUES (?, ?, ?)`,
            [payload.categoryId, payload.brandId, payload.itemName]
        );

        const itemId = itemResult.insertId;

        const [usedItemResult]: any = await connection.query(
            `INSERT INTO used_items (item_id, price, item_condition)
             VALUES (?, ?, ?)`,
            [itemId, payload.price, payload.condition]
        );

        const usedItemId = usedItemResult.insertId;

        const [adResult]: any = await connection.query(
            `INSERT INTO advertisements (user_id, used_item_id, description)
             VALUES (?, ?, ?)`,
            [userId, usedItemId, payload.description]
        );

        const adId = adResult.insertId;

        if (files.length > 0) {
            await saveUploadedFiles(connection, adId, files, savedFiles);
        }
        else {
            await connection.query(
                `INSERT INTO ad_files (ad_id, file_id)
                 VALUES (?, ?)`,
                [adId, "default-ad-picture"]
            );
        }

        await connection.commit();
        return adId;
    }
    catch (error) {
        await connection.rollback();
        cleanupSavedFiles(savedFiles);
        throw error;
    }
    finally {
        await connection.end();
    }
}

export async function getFilteredAdvertisementsService(query: AdvertisementFilterQuery): Promise<any> {
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
            limit = "20"
        } = query;

        const sqlConditions: string[] = [];
        const params: any[] = [];

        if (categoryIds) {
            const categoryArray = String(categoryIds).split(",").map((category) => category.trim());
            const categoryPlaceholders = categoryArray.map(() => "i.category_id = ?").join(" OR ");
            sqlConditions.push(`(${categoryPlaceholders})`);
            categoryArray.forEach((category) => params.push(Number(category)));
        }

        if (brandId) {
            sqlConditions.push("i.brand_id = ?");
            params.push(Number(brandId));
        }

        if (conditions) {
            const conditionArray = String(conditions).split(",").map((condition) => condition.trim());
            const conditionPlaceholders = conditionArray.map(() => "ui.item_condition = ?").join(" OR ");
            sqlConditions.push(`(${conditionPlaceholders})`);
            conditionArray.forEach((condition) => params.push(condition));
        }

        if (minPrice) {
            sqlConditions.push("ui.price >= ?");
            params.push(Number(minPrice));
        }

        if (maxPrice) {
            sqlConditions.push("ui.price <= ?");
            params.push(Number(maxPrice));
        }

        if (q) {
            const like = `%${String(q)}%`;
            sqlConditions.push("(i.name LIKE ? OR a.description LIKE ?)");
            params.push(like, like);
        }

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;
        const whereClause = sqlConditions.length > 0 ? `WHERE ${sqlConditions.join(" AND ")}` : "";

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

        return {
            page: pageNumber,
            limit: limitNumber,
            count: rows.length,
            data: formatAdsWithFiles(rows)
        };
    }
    finally {
        connection.release();
    }
}

export async function deleteOwnAdByIdService(adId: number, userId: number): Promise<void> {
    const connection = await mysql.createConnection(config.database);

    try {
        await connection.beginTransaction();

        const [[ad]]: any = await connection.query(
            `SELECT id, used_item_id FROM advertisements WHERE id = ? AND user_id = ?`,
            [adId, userId]
        );

        if (!ad) {
            await connection.rollback();
            throw new Error("AD_FORBIDDEN_OR_NOT_FOUND");
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
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        await connection.end();
    }
}

export async function patchAdByIdService(
    adId: number,
    userId: number,
    payload: AdvertisementMutationPayload,
    files: UploadedAdvertisementFile[] = []
): Promise<void> {
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
            throw new Error("AD_NOT_FOUND");
        }

        if (parseInt(ad.user_id, 10) !== userId) {
            await connection.rollback();
            throw new Error("AD_FORBIDDEN");
        }

        const usedItemId = ad.used_item_id;

        const [[usedItemRow]]: any = await connection.query(
            `SELECT item_id FROM used_items WHERE id = ?`,
            [usedItemId]
        );

        const itemId = usedItemRow?.item_id;

        if (itemId) {
            await connection.query(
                `UPDATE items SET name = COALESCE(?, name), category_id = COALESCE(?, category_id), brand_id = COALESCE(?, brand_id) WHERE id = ?`,
                [payload.itemName ?? null, payload.categoryId ?? null, payload.brandId ?? null, itemId]
            );
        }

        await connection.query(
            `UPDATE used_items SET price = COALESCE(?, price), item_condition = COALESCE(?, item_condition) WHERE id = ?`,
            [payload.price ?? null, payload.condition ?? null, usedItemId]
        );

        await connection.query(
            `UPDATE advertisements SET description = COALESCE(?, description) WHERE id = ?`,
            [payload.description ?? null, adId]
        );

        if (files.length > 0) {
            await connection.query(
                "DELETE FROM ad_files WHERE ad_id = ?",
                [adId]
            );

            await saveUploadedFiles(connection, adId, files, savedFiles);
        }

        await connection.commit();
    }
    catch (error) {
        await connection.rollback();
        cleanupSavedFiles(savedFiles);
        throw error;
    }
    finally {
        await connection.end();
    }
}

export async function getReportedAdsService(): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (results.length === 0) {
            throw new Error("NO_ADS");
        }

        return formatAdsWithFiles(results);
    }
    finally {
        await connection.end();
    }
}

export async function getReportedAdByIdService(adId: number): Promise<any[]> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (result.length === 0) {
            throw new Error("REPORTED_AD_NOT_FOUND");
        }

        return formatAdsWithFiles(result);
    }
    finally {
        await connection.end();
    }
}

export async function deleteAdFromReportedAdsByIdService(adId: number): Promise<void> {
    const connection = await mysql.createConnection(config.database);

    try {
        const [result] = await connection.query(
            "UPDATE advertisements SET is_reported = 0 WHERE id = ?",
            [adId]
        ) as Array<any>;

        if (result.affectedRows === 0) {
            throw new Error("REPORTED_AD_NOT_FOUND");
        }
    }
    finally {
        await connection.end();
    }
}

export async function deleteUsersAdByIdService(adId: number): Promise<void> {
    const connection = await mysql.createConnection(config.database);

    try {
        await connection.beginTransaction();

        const [reportedAdCheck] = await connection.query(
            "SELECT id FROM advertisements WHERE is_reported = 1 AND id = ?",
            [adId]
        ) as Array<any>;

        if (reportedAdCheck.length < 1) {
            await connection.rollback();
            throw new Error("REPORTED_AD_NOT_FOUND");
        }

        const [[ad]]: any = await connection.query(
            `SELECT id, used_item_id FROM advertisements WHERE id = ?`,
            [adId]
        );

        if (!ad) {
            await connection.rollback();
            throw new Error("AD_FORBIDDEN_OR_NOT_FOUND");
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
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        await connection.end();
    }
}
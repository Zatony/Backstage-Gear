import mysql from "mysql2/promise";
import config from "../config/config";
import { ICategory } from "./category";

const BASE_URL = "http://localhost:3000";

export async function getCategoriesService(): Promise<ICategory[]> {
    const connection = await mysql.createConnection(config.database);

    try {
        const [results] = await connection.query(
            "SELECT * FROM categories"
        ) as Array<any>;

        if (results.length === 0) {
            throw new Error("NO_CATEGORIES");
        }

        return results.map((row: ICategory) => ({
            ...row,
            picture: `${BASE_URL}/categories-pictures/${row.picture}`,
        }));
    }
    finally {
        await connection.end();
    }
}
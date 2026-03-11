import config from "../config/config";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import { ISignUpUser } from "./user.dto";


async function deleteUserData(connection: any, userId: number): Promise<void> {
    const [ads]: any = await connection.query(
        `SELECT id, used_item_id FROM advertisements WHERE user_id = ?`,
        [userId]
    );

    const usedItemIds = ads.map((a: any) => a.used_item_id);
    const adIds = ads.map((a: any) => a.id);

    if (adIds.length > 0) {
        await connection.query(
            `DELETE FROM carts WHERE ad_id IN (?)`,
            [adIds]
        );
    }

    await connection.query(
        `DELETE FROM carts WHERE user_id = ?`,
        [userId]
    );

    await connection.query(
        `DELETE FROM advertisements WHERE user_id = ?`,
        [userId]
    );

    if (usedItemIds.length > 0) {
        const [itemRows]: any = await connection.query(
            `SELECT item_id FROM used_items WHERE id IN (?)`,
            [usedItemIds]
        );

        const itemIds = itemRows.map((r: any) => r.item_id);

        await connection.query(
            `DELETE FROM used_items WHERE id IN (?)`,
            [usedItemIds]
        );

        if (itemIds.length > 0) {
            await connection.query(
                `DELETE FROM items WHERE id IN (?)`,
                [itemIds]
            );
        }
    }

    await connection.query(
        `DELETE FROM users WHERE id = ?`,
        [userId]
    );
}


export async function signInService(email: string, password: string) {
    const connection = await mysql.createConnection(config.database);

    try {
        const [result]: any = await connection.query(
            'SELECT login(?, ?) AS id',
            [email, password]
        );

        if (!result[0].id) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const [adminRows]: any = await connection.query(
            'SELECT is_admin FROM users WHERE id = ?',
            [result[0].id]
        );

        if (!config.jwtSecret) {
            throw new Error("JWT_SECRET_ERROR");
        }

        const token = jwt.sign(
            { id: result[0].id },
            config.jwtSecret,
            { expiresIn: "2h" }
        );

        return {
            token,
            is_admin: adminRows[0].is_admin
        };

    } finally {
        await connection.end();
    }
};


export async function signUpService(userData: ISignUpUser) {
    const newUser: ISignUpUser = { ...userData };

    if(
        !newUser.name ||
        !newUser.userName ||
        !newUser.email ||
        !newUser.phoneNumber ||
        !newUser.dateOfBirth ||
        !newUser.password
    ){
        throw new Error("INVALID_DATA");
    }

    const connection = await mysql.createConnection(config.database);

    try{
        await connection.beginTransaction();

        const [userResult]: any = await connection.query(
            'INSERT INTO users(name, username, email, phone_number, date_of_birth, password) VALUES (?, ?, ?, ?, ?, ?)',
            [newUser.name, newUser.userName, newUser.email, newUser.phoneNumber, newUser.dateOfBirth, newUser.password]
        );

        if(userResult.affectedRows === 0){
            throw new Error("SIGNUP_FAILED");
        }

        await connection.query(
            'INSERT INTO profiles (user_id) VALUES (?)',
            [userResult.insertId]
        );

        await connection.commit();

        const [result]: any = await connection.query(
            'SELECT login(?, ?) AS id',
            [newUser.email, newUser.password]
        );

        const [adminRows]: any = await connection.query(
            'SELECT is_admin FROM users WHERE id = ?',
            [result[0].id]
        );

        const token = jwt.sign(
            {
                id: result[0].id,
                is_admin: adminRows[0].is_admin
            },
            config.jwtSecret!,
            { expiresIn: "2h" }
        );

        return {
            message: "Sikeres regisztráció",
            token
        };

    }
    catch(err){
        await connection.rollback();
        throw err;
    }
    finally{
        await connection.end();
    }
};


export async function getIsAdminService(userId: number): Promise<boolean | null> {
    const connection = await mysql.createConnection(config.database);

    try {
        const [adminRows]: any = await connection.query(
            'SELECT is_admin FROM users WHERE id = ?',
            [userId]
        );

        if (adminRows.length > 0) {
            return adminRows[0].is_admin === 1;
        }

        return null;
    } 
    finally {
        await connection.end();
    }
};


export async function deleteOwnUserByIdService(userId: number): Promise<void> {
    const connection = await mysql.createConnection(config.database);

    try {
        await connection.beginTransaction();

        await deleteUserData(connection, userId);

        await connection.commit();
    } 
    catch (err) {
        await connection.rollback();
        throw err;
    } 
    finally {
        await connection.end();
    }
};


export async function deleteUserByIdService(userId: number): Promise<void> {
    const connection = await mysql.createConnection(config.database);

    try {
        await connection.beginTransaction();

        const [userCheck]: any = await connection.query(
            'SELECT id FROM users WHERE id = ?',
            [userId]
        );

        if (userCheck.length < 1) {
            throw new Error("USER_NOT_FOUND");
        }

        await deleteUserData(connection, userId);

        await connection.commit();
    }
    catch (err) {
        await connection.rollback();
        throw err;
    }
    finally {
        await connection.end();
    }
};


export async function updateOwnPasswordByIdService(userId: number, newPassword: string): Promise<void> {
    if (!newPassword || newPassword.trim() === "") {
        throw new Error("INVALID_PASSWORD");
    }

    const connection = await mysql.createConnection(config.database);

    try {
        const [result]: any = await connection.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [newPassword, userId]
        );

        if (result.affectedRows !== 1) {
            throw new Error("PASSWORD_UPDATE_FAILED");
        }
    } finally {
        await connection.end();
    }
};
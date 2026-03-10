import config from "../config/config";
//import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import { bodyIsUndefined, idIsNan } from "../validators/id.validator";
//import { IUser, User } from "./user";
import { signInService, signUpService, getIsAdminService, deleteOwnUserByIdService } from "./userService";


export async function signIn(req: any, res: any) {
    const { email, password } = req.body;

    if (!(email && password)) {
        res.status(400).send("Nem megfelelően megadott adatok.");
        return;
    }

    try {
        const result = await signInService(email, password);
        res.status(200).json(result);
    }
    catch (err: any) {
        if (err.message === "INVALID_CREDENTIALS") {
            return res.status(401).send("Hibás email vagy jelszó.");
        }

        res.status(500).send("Szerver hiba.");
    }
};


export async function signUp(req: any, res: any) {
    try {
        const result = await signUpService(req.body);
        res.status(201).json(result);
    } 
    catch (err: any) {
        if(err.message === "INVALID_DATA"){
            return res.status(400).send("Hibásan vagy hiányosan megadott adatok.");
        }

        res.status(500).send("Regisztráció sikertelen.");
    }
};


export async function getIsAdminById(req: any, res: any) {
    const userId: number = parseInt(req.user.id);

    try {
        const isAdmin = await getIsAdminService(userId);

        if (isAdmin === null) {
            res.status(404).send("Nem létezik ilyen azonosítójú felhasználó.");
        } 
        else {
            res.status(200).send({ is_admin: isAdmin });
        }
    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function deleteOwnUserById(req: any, res: any) {
    const userId: number = parseInt(req.user.id);

    try {
        await deleteOwnUserByIdService(userId);
        res.status(204).send();
    } 
    catch (err) {
        console.error(err);
        res.status(500).send("A felhasználó törlése nem sikerült.");
    }
};


export async function updateOwnPasswordById(req: any, res: any) {
    const userId: number = parseInt(req.user.id);

    bodyIsUndefined(req, res);

    if (req.body.password.trim() === "") {
        res.status(400).send("Hiányosan megadott adatok.");
        return;
    };

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [req.body.password, userId]
        ) as Array<any>;

        if(result.affectedRows === 1){
            res.status(204).send();
            return;
        };

        res.status(404).send("Nem sikerült a jelszó módosítása.");
    }
    catch(err){
        console.log(err);
    }
    finally{
        await connection.end();
    }
};


////// ADMIN

export async function deleteUserById(req: any, res: any) {
    const userId: number = parseInt(req.params.userId);

    idIsNan(userId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        await connection.beginTransaction();

        const [userCheck] = await connection.query(
            'SELECT id FROM users WHERE id = ?',
            [userId]
        ) as Array<any>;

        if(userCheck.length < 1){
            res.status(404).send("Nem létezik ilyen azonosítójú felhasználó.");
            return;
        };

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
            await connection.query(
                `DELETE FROM used_items WHERE id IN (?)`,
                [usedItemIds]
            );
        }

        const [itemRows]: any = await connection.query(
            `SELECT item_id FROM used_items WHERE id IN (?)`,
            [usedItemIds]
        );

        const itemIds = itemRows.map((r: any) => r.item_id);

        if (itemIds.length > 0) {
            await connection.query(
                `DELETE FROM items WHERE id IN (?)`,
                [itemIds]
            );
        }

        await connection.query(
            `DELETE FROM users WHERE id = ?`,
            [userId]
        );

        await connection.commit();
        res.status(204).send();
    }
    catch(err){
        await connection.rollback();
        console.log(err);
    }
    finally{
        await connection.end();
    }
};
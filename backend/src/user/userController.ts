import config from "../config/config";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import { bodyIsUndefined, idIsNan } from "../validators/id.validator";
import { IUser, User } from "./user";


export async function signIn(req: any, res: any) {
    const {email, password} = req.body;
    
    if(!(email && password)){
        res.status(400).send("Nem megfelelően megadott adatok.");
        return;
    };

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            'SELECT login(?, ?) AS id',
            [email, password]
        ) as Array<any>;

        if(!result[0].id){
            res.status(401).send("Hibásan megadott email vagy jelszó.");
            return;
        };

        if(!config.jwtSecret){
            res.status(500).send("Hiba van a titkos kulcsnál.");
            return;
        };

        const [adminRows] = await connection.query(
            'SELECT is_admin FROM users WHERE id = ?',
            [result[0].id]
        ) as Array<any>;

        const token = jwt.sign(
            {
                id: result[0].id,
                is_admin: adminRows[0].is_admin
            },
            config.jwtSecret, 
            {expiresIn: "2h"}
        );

        res.status(201).send({token: token,
        is_admin: adminRows[0].is_admin
        });
    }
    catch(err){
        console.log(err);
    }
    finally{
        await connection.end();
    }
};


export async function signUp(req: any, res: any) {
    bodyIsUndefined(req, res);

    let newUser: any = new User(req.body as IUser);

    if(
        newUser.name == "" || !newUser.name ||
        newUser.userName == "" || !newUser.userName ||
        newUser.email == "" || !newUser.email ||
        newUser.phoneNumber == "" || !newUser.phoneNumber ||
        newUser.dateOfBirth == "" || !newUser.dateOfBirth ||
        newUser.password == "" || !newUser.password
    ){
        res.status(400).send("Hibásan vagy hiányosan megadott adatok.");
        return;
    };

    const connection = await mysql.createConnection(config.database);

    try{
        await connection.beginTransaction();

        const [userResult]: any = await connection.query(
            'INSERT INTO users(name, username, email, phone_number, date_of_birth, password) VALUES (?, ?, ?, ?, ?, ?)',
            [newUser.name, newUser.userName, newUser.email, newUser.phoneNumber, newUser.dateOfBirth, newUser.password]
        );

        if(userResult.affectedRows === 0){
            throw new Error("Nem sikerült a regisztráció.");
        };


        await connection.query(
            'INSERT INTO profiles (user_id) VALUES (?)',
            [userResult.insertId]
        );

        await connection.commit();


        // regisztráció utáni bejelentkeztetés

        const {email, password} = req.body;

        const [result] = await connection.query(
            'SELECT login(?, ?) AS id',
            [email, password]
        ) as Array<any>;

        const [adminRows] = await connection.query(
            'SELECT is_admin FROM users WHERE id = ?',
            [result[0].id]
        ) as Array<any>;

        const token = jwt.sign(
            {
                id: result[0].id,
                is_admin: adminRows[0].is_admin
            },
            config.jwtSecret, 
            {expiresIn: "2h"}
        );


        res.status(201).json({
            message: "Sikeres regisztráció",
            token
        });
    }
    catch(err){
        await connection.rollback();
        console.log(err);
    }
    finally{
        await connection.end();
    }
};


export async function deleteOwnUserById(req: any, res: any){
    const userId: number = parseInt(req.user.id);

    const connection = await mysql.createConnection(config.database);

    try{
        await connection.beginTransaction();

        const [rows]: any = await connection.query(`
            SELECT DISTINCT ui.item_id
            FROM used_items ui
            INNER JOIN advertisements a ON a.used_item_id = ui.id
            WHERE a.user_id = ?
        `, [userId]);

        const itemIds = rows.map((r: any) => r.item_id);

        await connection.query(`
            DELETE ui
            FROM used_items ui
            INNER JOIN advertisements a ON a.used_item_id = ui.id
            WHERE a.user_id = ?
        `, [userId]);

        if (itemIds.length > 0) {
            await connection.query(
                `DELETE FROM items WHERE id IN (?)`,
                [itemIds]
            );
        };

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

        const [rows]: any = await connection.query(`
            SELECT DISTINCT ui.item_id
            FROM used_items ui
            INNER JOIN advertisements a ON a.used_item_id = ui.id
            WHERE a.user_id = ?
        `, [userId]);

        const itemIds = rows.map((r: any) => r.item_id);

        await connection.query(`
            DELETE ui
            FROM used_items ui
            INNER JOIN advertisements a ON a.used_item_id = ui.id
            WHERE a.user_id = ?
        `, [userId]);

        if (itemIds.length > 0) {
            await connection.query(
                `DELETE FROM items WHERE id IN (?)`,
                [itemIds]
            );
        };

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
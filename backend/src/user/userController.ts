import config from "../config/config";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import { bodyIsUndefined } from "../validators/id.validator";
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
            'INSERT INTO profiles(user_id, up_vote, down_vote) VALUES (?, ?, ?)',
            [userResult.insertId, 0, 0]
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
};
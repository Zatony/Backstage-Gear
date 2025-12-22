import { Request, Response } from "express";
import { idIsNan } from "../validators/id.validator";
import config from "../config/config";
import mysql from "mysql2/promise";


export async function getProfileDatasById(req: Request, res: Response){
    const userId: number = parseInt(req.params.userId);
    idIsNan(userId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            `SELECT 
                profiles.id, 
                users.username, 
                users.phone_number, 
                profiles.profile_picture, 
                profiles.up_vote, 
                profiles.down_vote
            FROM profiles
            INNER JOIN users ON profiles.user_id = users.id
            WHERE users.id = ?;`,
            [userId]
        ) as Array<any>;

        if(result.length > 0){
            res.status(200).send(result);
            return;
        };

        res.status(404).send("Ilyen azonosítójú felhasználó még nem létezik.");
    }
    catch(err){
        console.log(err);
    }

    /*
    const userResult = datas.some(u => u.userName === userName);
    if(!userResult){
        res.status(404).send("Ez a felhasználó még nem létezik.");
        return;
    };

    const result = datas.find(p => p.userName === userName);
    if(result){
        res.status(200).send(result);
        return;
    };
    */
};
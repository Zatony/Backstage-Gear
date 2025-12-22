import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../config/config";
import { idIsNan } from "../validators/id.validator";


async function isUserExisted(id: number, res: Response, connection: any){
    const [result] = await connection.query(
        'SELECT id FROM users WHERE id = ?',
        [id]
    ) as Array<any>;

    if(result.length === 0){
        res.status(404).send("Ez a felhasználó nem létezik.");
        return;
    };
};


export async function getUserIncomingMessages(req: Request, res: Response){
    const userId: number = parseInt(req.params.userId);
    idIsNan(userId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        isUserExisted(userId, res, connection);


        const [results] = await connection.query(
            `SELECT
                messages.id,
                messages.sender_id,
                messages.receiver_id,
                messages.content,
                DATE_FORMAT(messages.sent_at, '%Y-%m-%d') AS sent_at
            FROM messages
            INNER JOIN users AS receiver ON messages.receiver_id = receiver.id
            WHERE messages.receiver_id = ?
            ORDER BY messages.sent_at DESC;`,
            [userId]
        ) as Array<any>;

        if(results.length > 0){
            res.status(200).send(results);
            return;
        };

        res.status(404).send("Nincsenek beérkező üzenetek.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getUserIcomingMessageById(req: Request, res: Response){
    const userId: number = parseInt(req.params.userId);
    const messageId: number = parseInt(req.params.messageId);

    idIsNan(userId, res);
    idIsNan(messageId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        isUserExisted(userId, res, connection);


        const [result] = await connection.query(
            `SELECT
                messages.id,
                messages.sender_id,
                messages.receiver_id,
                messages.content,
                DATE_FORMAT(messages.sent_at, '%Y-%m-%d') AS sent_at
            FROM messages
            INNER JOIN users AS receiver ON messages.receiver_id = receiver.id
            WHERE messages.receiver_id = ? AND messages.id = ?
            ORDER BY messages.sent_at DESC;`,
            [userId, messageId]
        ) as Array<any>;

        if(result.length > 0){
            res.status(200).send(result);
            return;
        };

        res.status(404).send("Nem létezik ilyen azonosítójú elem.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getUserSentMessages(req: Request, res: Response){
    const userId: number = parseInt(req.params.userId);
    idIsNan(userId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        isUserExisted(userId, res, connection);


        const [results] = await connection.query(
            `SELECT
                messages.id,
                messages.sender_id,
                messages.receiver_id,
                messages.content,
                DATE_FORMAT(messages.sent_at, '%Y-%m-%d') AS sent_at
            FROM messages
            INNER JOIN users AS sender ON messages.sender_id = sender.id
            WHERE messages.sender_id = ?
            ORDER BY messages.sent_at DESC;`,
            [userId]
        ) as Array<any>;

        if(results.length > 0){
            res.status(200).send(results);
            return;
        };

        res.status(404).send("Nincsenek elküldött üzenetek.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getUserSentMessageById(req: Request, res: Response){
    const userId: number = parseInt(req.params.userId);
    const messageId: number = parseInt(req.params.messageId);

    idIsNan(userId, res);
    idIsNan(messageId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        isUserExisted(userId, res, connection);


        const [result] = await connection.query(
            `SELECT
                messages.id,
                messages.sender_id,
                messages.receiver_id,
                messages.content,
                DATE_FORMAT(messages.sent_at, '%Y-%m-%d') AS sent_at
            FROM messages
            INNER JOIN users AS sender ON messages.sender_id = sender.id
            WHERE messages.sender_id = ? AND messages.id = ?
            ORDER BY messages.sent_at DESC;`,
            [userId, messageId]
        ) as Array<any>;

        if(result.length > 0){
            res.status(200).send(result);
            return;
        };

        res.status(404).send("Nem létezik ilyen azonosítójú elem.");
    }
    catch(err){
        console.log(err);
    }
};